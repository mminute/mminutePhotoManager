/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import recursiveReadDir from 'recursive-readdir';
import Store from 'electron-store';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { actions } from '../constants';
import DataManager from '../DataManager/DataManager';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let currentDirectory = '';
let dataFilePath = '';
const dataManager = new DataManager();

const RecentDirectoriesKey = 'recentDirectories';

const defaults = {
  [RecentDirectoriesKey]: [],
};

const localStore = new Store({ defaults });

function pushToRecentDirectories(newDirectory: string) {
  const recentDirectories = localStore.get(RecentDirectoriesKey, []);

  const updatedDirectories = [
    newDirectory,
    ...recentDirectories.filter((dir) => dir !== newDirectory).slice(0, 2),
  ];

  localStore.set(RecentDirectoriesKey, updatedDirectories);
}

ipcMain.on(actions.SELECT_DIRECTORY, (event) => {
  if (mainWindow) {
    dialog
      .showOpenDialog(mainWindow, {
        title: 'Choose the folder containing your images',
        properties: ['openDirectory'],
      })
      .then(({ canceled, filePaths }) => {
        if (canceled) {
          return;
        }

        const selectedDirectory = filePaths[0];
        currentDirectory = selectedDirectory;

        pushToRecentDirectories(selectedDirectory);

        recursiveReadDir(
          // https://github.com/jergason/recursive-readdir
          selectedDirectory,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (_err: any, files: string[]) => {
            const imagePaths = files.filter((fileName) =>
              // TODO: Update regex if additional image types are acceptable
              // Digital cameras typically produce .jpg, .raw, .tiff files
              // Looks like you might be able to use .raw and .tiff by
              // setting the 'src' to the file
              /\.jpg$/.test(fileName.toLowerCase())
            );

            // Find the json file where annotated image data is stored
            const targetFilepath = files.find((fileName) => {
              return new RegExp(`${currentDirectory}/.*.photoManager$`).test(
                fileName
              );
            });

            let dataObject = { photos: [], people: [] };

            if (targetFilepath) {
              dataFilePath = targetFilepath;
              const rawDataString = fs.readFileSync(targetFilepath).toString();
              dataObject = JSON.parse(rawDataString);
            } else {
              const filepath = `${currentDirectory}/${path.basename(
                currentDirectory
              )}.photoManager`;

              dataFilePath = filepath;

              fs.writeFileSync(filepath, JSON.stringify(dataObject));
            }

            dataManager.initialize({ data: dataObject, imagePaths });

            event.reply(
              actions.FILEPATHS_OBTAINED,
              dataManager.photos,
              dataManager.tags,
              dataManager.placesMap,
              dataManager.citiesMap,
              dataManager.people,
              currentDirectory
            );
          }
        );
      })
      .catch(() => {});
  }
});

ipcMain.on(actions.SAVE_PHOTO_MANAGER, (event) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(dataManager.state));

  event.reply(actions.SAVE_PHOTO_MANAGER_SUCCESS);
});

ipcMain.on(actions.UPDATE_PHOTO_DATA, (event, annotationData) => {
  dataManager.updatePhoto(annotationData);

  event.reply(
    actions.UPDATE_PHOTO_DATA_COMPLETE,
    dataManager.photos,
    dataManager.tags,
    dataManager.placesMap,
    dataManager.citiesMap,
    dataManager.people
  );
});

ipcMain.on(actions.CREATE_PERSON, (event, personData) => {
  dataManager.createPerson(personData);
  event.reply(actions.CREATE_PERSON_SUCCESS, dataManager.people);
});

ipcMain.on(actions.UPDATE_PERSON, (event, updateData) => {
  dataManager.updatePerson(updateData);
  event.reply(actions.UPDATE_PERSON_SUCCESS, dataManager.people);
});

ipcMain.on(actions.DELETE_PERSON, (event, targetId) => {
  dataManager.deletePerson(targetId);
  event.reply(
    actions.DELETE_PERSON_SUCCESS,
    dataManager.photos,
    dataManager.people
  );
});

ipcMain.on(actions.SCRUB_EXIF_DATA, (event, photoIds, locationsToScrub) => {
  dataManager.scrubExifData(photoIds, locationsToScrub);
  fs.writeFileSync(dataFilePath, JSON.stringify(dataManager.state));
  event.reply(actions.SCRUB_EXIF_DATA_SUCCES, dataManager.photos);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
