import { localEnv } from './environment.local'
import { IEnvironment } from './environment.model'
import { prodEnv } from './environment.prod'

const environments: IEnvironment[] = [localEnv, prodEnv]

const baseEnvironment: IEnvironment = prodEnv

export const environment: IEnvironment = {
  ...baseEnvironment,
}
