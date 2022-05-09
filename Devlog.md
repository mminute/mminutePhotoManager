# Dev Log

### 2022-05-09
- TODO: Update filepaths to only store the filepath relative to the selected directory
  - Append the directory to the photo filepath when you need to access the image
  - This way the directory can be moved without causing issues with the data
- Image orientation:
  - metadata.Image.Orientation
    - https://piexifjs.readthedocs.io/en/latest/sample.html
- Installed and used [image-size](https://www.npmjs.com/package/image-size) package to images missing metadata

### 2022-05-08
- Added reading/writing from a file
- Next:
  - Figure out gallery view
  - Figure out what user data to collect
  - Add UI to display and collect metadata and annotations
  - Update each photo for changes to data UI
### 2022-05-05
- Trying to get photo metadata with [piexifjs](https://github.com/hMatoba/piexifjs)
  - based on this [article](https://auth0.com/blog/read-edit-exif-metadata-in-photos-with-javascript/#The--Piexifjs--Library)
- 

### 2022-05-04
Proposed dev sequence
1. Get files in directory ✅
2. Get image metadata ✅
3. Display the images and metadata
4. Collect user input
5. Write the data to a file
### 2022-05-03
- Question: how to get metadata from photos themselves?
  - https://techsparx.com/nodejs/graphics/image-metadata.html
  - https://auth0.com/blog/read-edit-exif-metadata-in-photos-with-javascript/


What do I want this app to do?
- Display images
  - handle rotating images if annotated as such
  - alt text from photo description?
- Annotate photos with:
  - Date
    - Created
    - Modified?
  - Location
  - Description/notes
  - People
  - Camera and exposure settings
  - File data -> dimensions, etc
  - Tags/keywords?
- Rename/move files
- Export a collection of files and metadata
- Strip/modify exif data?

Some possible existing metadata:
- https://turbofuture.com/computers/How-to-Work-with-Image-Metadata
- https://www.youtube.com/watch?v=SLw0xeoLicM
- Example fields
  - Title
  - Caption
  - Copyright
  - Copyright status

### 2022-05-01
- Added [recursive-readdir](https://www.npmjs.com/package/recursive-readdir)- To get nested files
- Added [electron-store](https://www.npmjs.com/package/electron-store) to persist user preferences

### 2022-04-26
- Forked [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) as [mminutePhotoManager](https://github.com/mminute/mminutePhotoManager)
- Ran the application
  - `npm install`
  - `npm start`
