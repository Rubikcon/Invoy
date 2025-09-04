/**
 * TypeScript definitions for Ethereum provider API
 */

export interface EthereumProvider {
  request: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (eventName: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

export interface EthereumError extends Error {
  code: number;
  message: string;
}
