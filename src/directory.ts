import { extname, resolve } from 'path'
import { readdir } from 'fs/promises'

export const getDirContents = async (startDir: string, filesAcc: string[] = []): Promise<string[]> => {
  const entries = await readdir(startDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await getDirContents(resolve(startDir, entry.name), filesAcc)
    } else if (extname(entry.name) === '.wav') {
      filesAcc.push(resolve(startDir, entry.name))
    }
  }
  return filesAcc
}
