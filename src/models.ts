type valueof<T> = T[keyof T]

const routes = {
  decrypt: '/decrypt',
  encrypt: '/encrypt',
  oneWayEncrypt: '/one-way-encrypt',
  status: '/status'
} as const

export type Route = valueof<typeof routes>

const appStatus = {
  sleeping: 'App is sleeping',
  startingUp: 'App is starting up',
  ready: 'App is ready for use',
  error: 'App has encountered an error',
} as const

export type AppStatus = keyof typeof appStatus
