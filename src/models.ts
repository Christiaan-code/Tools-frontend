const routes = {
  decrypt: '/decrypt',
  encrypt: '/encrypt',
  oneWayEncrypt: '/one-way-encrypt',
} as const

export type Route = valueof<typeof routes>

type valueof<T> = T[keyof T]
