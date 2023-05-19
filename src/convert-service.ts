import { parentPort, workerData } from 'worker_threads'
import { basename, dirname, join } from 'path'
import { ensureDir } from 'fs-extra'
import { Lame } from 'node-lame'
import { type ConvertedFile, type ConverterRequest } from './types.js'

const data = workerData as ConverterRequest

const converted: ConvertedFile[] = []

for (const input of data.files) {
  const output = data.saveTo === undefined
    ? join(dirname(input), basename(input, '.wav') + '.mp3')
    : join(data.saveTo, basename(input, '.wav') + '.mp3')

  await ensureDir(dirname(output))

  const encoder = new Lame({
    output
  }).setFile(input)

  try {
    await encoder.decode()
    converted.push({ input, output, status: 'Success' })
  } catch (e: unknown) {
    let status: string
    if (e instanceof Error) {
      status = `Failed: ${e.message}`
    } else {
      status = 'Failed'
    }
    converted.push({ input, output, status })
  }
}

parentPort?.postMessage({ converted })
