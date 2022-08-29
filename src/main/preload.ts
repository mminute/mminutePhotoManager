import { NewPersonData } from 'DataManager/PeopleManager/PeopleManager';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { PhotoUpdateData } from '../renderer/PhotoView/types';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    createPerson(personData: NewPersonData) {
      ipcRenderer.send('create-person', personData);
    },
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
    savePhotoManager() {
      ipcRenderer.send('save-photo-manager');
    },
    updatePhotoData(annotationData: PhotoUpdateData) {
      ipcRenderer.send('update-photo-data', annotationData);
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
