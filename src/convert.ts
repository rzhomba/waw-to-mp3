import { cpus } from 'os'
import { Worker } from 'worker_threads'
import { type ConvertedFile, type ConverterRequest, type ConverterResponse } from './types.js'

export const runConvertService = async (workerData: any): Promise<ConverterResponse> => {
  return await new Promise((resolve, reject) => {
    const worker = new Worker('./build/convert-service.js', { workerData })
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
}

export const convertFiles = async (
  data: ConverterRequest,
  batchCb?: (files: ConvertedFile[]) => void,
  batchSize?: number
): Promise<ConvertedFile[]> => {
  const { files, saveTo } = data
  const allConverted: ConvertedFile[] = []

  let batchCount = 0
  let batchConverted: ConvertedFile[] = []

  let fileChunks: string[][] = []
  for (let i = cpus().length; i > 0; i--) {
    fileChunks.push(files.splice(0, Math.ceil(files.length / i)))
  }
  fileChunks = fileChunks.filter(chunk => chunk.length > 0)

  await Promise.all(fileChunks.map(async (files) => {
    const data: ConverterRequest = {
      files,
      saveTo
    }

    const result = await runConvertService(data)
    allConverted.push(...result.converted)
    batchConverted.push(...result.converted)

    batchCount += result.converted.length

    if (batchSize !== undefined && batchCount >= batchSize) {
      let tempList: ConvertedFile[] = []
      let tempCount = 0
      if (batchCount > batchSize) {
        tempList = batchConverted.splice(batchConverted.length - (batchCount - batchSize))
        tempCount = tempList.length
      }

      batchCb?.(batchConverted)
      batchCount = tempCount
      batchConverted = tempList
    }
  }))

  if (batchConverted.length > 0) {
    batchCb?.(batchConverted)
  }

  return allConverted
}
