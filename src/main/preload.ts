import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    selectDirectory() {
      ipcRenderer.send('select-directory');
      // ipcRenderer.send('selec-directory', 'ping');
      // Then in `main`
      // ipcMain.on('ipc-example', async (event, arg) => {
      //   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
      //   console.log(msgTemplate(arg));
      //   event.reply('ipc-example', msgTemplate('pong'));
      // });
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
    removeListener(channel: string, listener: (...args: unknown[]) => void) {
      ipcRenderer.removeListener(channel, listener);
    },
  },
});
