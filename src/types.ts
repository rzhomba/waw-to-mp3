export interface Arg {
  name: string
  value?: string
}

export interface ConverterRequest {
  files: string[]
  saveTo?: string
}

export interface ConvertedFile {
  input: string
  output: string
  status: string
}

export interface ConverterResponse {
  converted: ConvertedFile[]
}
