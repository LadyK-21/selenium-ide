import type { BrowserWindowConstructorOptions } from 'electron'

/**
 * Open a window by name with options
 */
export type Shape = (
  name: string,
  opts?: BrowserWindowConstructorOptions
) => Promise<void>
