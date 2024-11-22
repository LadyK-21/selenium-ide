import { ipcRenderer } from 'electron'
import {
  ApiPromiseHandler,
  DefaultRouteShape,
  ThenArg,
} from '@seleniumhq/side-api'

const doAPI = async <HANDLER extends ApiPromiseHandler>(
  path: string,
  ...args: Parameters<HANDLER>
): Promise<ThenArg<ReturnType<HANDLER>>> => {
  console.debug('Emitting to server', path, 'with args', args)
  const result = await ipcRenderer.invoke(path, ...args)
  console.debug('Reply from server', path, 'with results', result)
  return result as ThenArg<ReturnType<HANDLER>>
}

const Handler =
  <HANDLER extends ApiPromiseHandler = DefaultRouteShape>() =>
  (path: string) => {
    return async (
      ...args: Parameters<HANDLER>
    ): Promise<ThenArg<ReturnType<HANDLER>>> => {
      console.debug(path, 'api called', ...(args as any))
      const result = await doAPI<HANDLER>(path, ...args)
      console.debug(path, 'api complete', result)
      return result
    }
  }

export default Handler
