import { NewPersonData } from 'DataManager/PeopleManager/PeopleManager';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { OnUpdateArgs } from 'renderer/BulkActions/Edit/Annotations';
import { PhotoUpdateData } from '../renderer/PhotoView/types';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    bulkEditPhotos(photoIds: string[], updateData: OnUpdateArgs) {
      ipcRenderer.send('bulk-edit-photos', photoIds, updateData);
    },
    createPerson(personData: NewPersonData) {
      ipcRenderer.send('create-person', personData);
    },
    deletePerson(targetId: string) {
      ipcRenderer.send('delete-person', targetId);
    },
    deletePhotos(photoIds: string[]) {
      ipcRenderer.send('delete-photos', photoIds);
    },
    exportPhotos(photoIds: string[], targetDirectory: string) {
      ipcRenderer.send('export-photos', photoIds, targetDirectory);
    },
    moveFiles(photoIds: string[], targetDirectory: string) {
      ipcRenderer.send('move-files', photoIds, targetDirectory);
    },
    scrubExifData(
      photoIds: string[],
      locationsToScrub: 'image-files-only' | 'image-files-and-database'
    ) {
      ipcRenderer.send('scrub-exif-data', photoIds, locationsToScrub);
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
    selectExportDirectory() {
      ipcRenderer.send('select-export-directory');
    },
    selectMoveTarget() {
      ipcRenderer.send('select-move-target');
    },
    updatePerson(personUpdates: NewPersonData) {
      ipcRenderer.send('update-person', personUpdates);
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
