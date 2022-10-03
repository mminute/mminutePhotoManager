import { NewPersonData } from 'DataManager/PeopleManager/PeopleManager';
import { PhotoUpdateData } from './PhotoView/types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        createPerson(newPerson: NewPersonData): void;
        deletePerson(targetId: string): void;
        updatePerson(personUpdates: NewPersonData): void;
        selectDirectory(): void;
        savePhotoManager(): void;
        updatePhotoData(updatedData: PhotoUpdateData): void;
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
