import { argv } from 'process'
import { sep } from 'path'
import axios from 'axios'
import { type Arg } from './types.js'
import { getDirContents } from './directory.js'
import { convertFiles } from './convert.js'

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

const saveArg = args.find(a => a.name === 'save')
const save = saveArg !== undefined

const urlArg = args.find(a => a.name === 'url')
const url = urlArg?.value

const files: string[] = []
for (const directory of directories) {
  files.push(...await getDirContents(directory))
}

const date = new Date()
const saveTo = save
  ? `var/spool/asterisk/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  : undefined

const result = await convertFiles({ files, saveTo })
const converted = result
  .filter(r => r.status === 'Success')
  .map(r => r.output)

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
