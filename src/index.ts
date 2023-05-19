import { argv } from 'process'
import axios from 'axios'
import { getDirContents } from './directory.js'
import { convertFiles } from './convert.js'
import { type Arg, type ConvertedFile } from './types.js'

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
const directories = dirArg.value.split(',')

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

const send = (files: ConvertedFile[]): void => {
  if (url !== undefined) {
    axios.post(url, { converted: files.map(f => f.output) })
      .catch(e => {
        if (e instanceof Error) {
          console.error(`Error: ${e.message}`)
        }
      })
  }
}

const result = await convertFiles({ files, saveTo }, send, 1000)
const converted = result
  .filter(r => r.status === 'Success')
  .map(r => r.output)

console.info('Done: ', converted)
