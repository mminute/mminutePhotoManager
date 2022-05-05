declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        selectDirectory(): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        removeListener(
          channel: string,
          func: (...args: unknown[]) => void
        ): void;
      };
    };
  }
}

export {};
