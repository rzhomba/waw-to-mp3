import { Worker } from 'worker_threads'
import { type ConverterResponse } from './types.js'

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
