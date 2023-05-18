import { parentPort, workerData } from 'worker_threads'
import path from 'path'
import { Lame } from 'node-lame'
import { type ConverterRequest } from './types.js'

const data = workerData as ConverterRequest

const input = data.file

const output = path.join(
  path.dirname(input),
  path.basename(input, '.wav') + '.mp3'
)

const encoder = new Lame({
  output
}).setFile(input)

try {
  await encoder.decode()
  parentPort?.postMessage({ input, output, status: 'Success' })
} catch (e: unknown) {
  let status: string
  if (e instanceof Error) {
    status = `Failed: ${e.message}`
  } else {
    status = 'Failed'
  }
  parentPort?.postMessage({ input, output, status })
}
