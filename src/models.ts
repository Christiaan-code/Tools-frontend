type valueof<T> = T[keyof T]

const routes = {
  decrypt: '/decrypt',
  encrypt: '/encrypt',
  oneWayEncrypt: '/one-way-encrypt',
  status: '/status',
} as const

export type Route = valueof<typeof routes>

const appStatus = {
  sleeping: 'App is sleeping',
  startingUp: 'App is starting up',
  ready: 'App is ready for use',
  error: 'App has encountered an error',
} as const

export type AppStatus = keyof typeof appStatus

export interface BulkEncryptRequest {
  type: 'bulk-one-way-encrypt'
  data: string[]
}

export interface BulkEncryptResponse {
  type: 'bulk-one-way-encrypt-result'
  original: string
  encrypted: string
}

export interface BulkEncryptProgress {
  type: 'bulk-one-way-encrypt-progress'
  processed: number
  total: number
}

export interface BulkEncryptStatus {
  type: 'bulk-one-way-encrypt-status'
  status: 'complete' | 'error'
  message?: string
}

export interface WebSocketError {
  type: 'error'
  message: string
}

export type WebSocketMessage =
  | BulkEncryptRequest
  | BulkEncryptResponse
  | BulkEncryptProgress
  | BulkEncryptStatus
  | WebSocketError
