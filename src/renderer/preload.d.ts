import { NewPersonData } from 'DataManager/PeopleManager/PeopleManager';
import { PhotoUpdateData } from './PhotoView/types';
import { OnUpdateArgs as BulkPhotoUpdateData } from './BulkActions/Edit/Annotations';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        bulkEditPhotos(
          photoIds: string[],
          bulkUpdates: BulkPhotoUpdateData
        ): void;
        createPerson(newPerson: NewPersonData): void;
        deletePerson(targetId: string): void;
        deletePhotos(photoIds: string[]): void;
        exportPhotos(photoIds: string[], targetDirectory: string): void;
        moveFiles(photoIds: string[], targetDirectory: string): void;
        openRecentDirectory(filepath: string): void;
        scrubExifData(
          photoIds: string[],
          locationsToScrub: 'image-files-only' | 'image-files-and-database'
        ): void;
        selectDirectory(): void;
        selectExportDirectory(): void;
        selectMoveTarget(): void;
        updatePerson(personUpdates: NewPersonData): void;
        updatePhotoData(updatedData: PhotoUpdateData): void;
        updateCollectionNote(note: string): void;
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
