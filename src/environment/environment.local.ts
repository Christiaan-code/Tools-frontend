import { IEnvironment } from './environment.model'

const baseBackendUrl = 'localhost:1000'

export const localEnv: IEnvironment = {
  environmentName: 'local',
  backendUrl: `http://${baseBackendUrl}`,
  websocketUrl: `ws://${baseBackendUrl}`,
}
