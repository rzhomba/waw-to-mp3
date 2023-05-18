export interface Arg {
  name: string
  value?: string
}

export interface ConverterRequest {
  file: string
  saveTo?: string
}

export interface ConverterResponse {
  input: string
  output: string
  status: string
}
