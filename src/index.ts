import { argv } from 'process'
import { sep } from 'path'
import axios from 'axios'
import { type Arg } from './types.js'
import { getDirContents } from './directory.js'
import { runConvertService } from './convert.js'

const args: Arg[] = []
for (const arg of argv.slice(2)) {
  const split = arg.split('=')
  args.push({
    name: split[0],
    value: split[1]
  })
}

const dirArg = args.find(a => a.name === 'dir')
if (dirArg === undefined || dirArg.value === undefined) {
  throw new Error('Missing dir argument')
}
const directories = dirArg.value.split(sep)

const urlArg = args.find(a => a.name === 'url')
const url = urlArg?.value

const converted: string[] = []

for (const directory of directories) {
  const files = await getDirContents(directory)
  for (const file of files) {
    const result = await runConvertService({ file })
    if (result.status === 'Success') {
      converted.push(result.output)
    }
  }
}

console.info('Done: ', converted)

if (url !== undefined) {
  try {
    await axios.post(url, { converted })
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(`Error: ${e.message}`)
    }
  }
}
