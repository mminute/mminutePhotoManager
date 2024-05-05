# Dev Log

## TODOS:
- Update base64 string if the file last modified time is sooner than the last time the photo collection was updated [stack overflow](https://stackoverflow.com/questions/7559555/last-modified-file-date-in-node-js)
- ✅ Add text field to add notes on photo collection?
- ✅ Date photo collection updated?
- ✅ Date each photo was updated?
- Warn if importing duplicate image?
- Build base64 string each time since someone may have replaced the photo
- Annotated/Unannotated tooltip positioned kinda far away
- ✅ Remove the app level save button and update directly from photos/people etc
- Photo filtering - What to do if there is a place name that appears multiple times for different country/state/cities?
- Date picker in bulk actions - Edit menu gets cut off
- Error popovers in bulk actions - edits are buggy
- ✅ Replace bulk actions dropdown with buttons
- ✅ Filter to only unannotated?
- Sort directory tree alphabetically at each level
- Update filepaths to only store the filepath relative to the selected directory
  - Append the directory to the photo filepath when you need to access the image
  - This way the directory can be moved without causing issues with the data
- ✅ Instead of updating file path to be relative I'm going to be lazy and add an attribute to the `Photo()` that is just the relative path when each object is instantiated

### 2024-04-26
- Completed all the features in [[Features.md]]

### 2024-04-11
- Finished export functionality -> exporting image and data to a new folder

### 2023-01-08
- Added multi select logic

### 2022-12-24
- Add selectable file tree

### 2022-11-27
- Added moment.js to handle date comparison
  - [website](https://momentjs.com/)
  - `npm install moment --save`

### 2022-08-28
- Able to create a person and tag them in a photo

### 2022-05-28
- Moved UserAnnotationDisplay state up to AnnotationDataManager to make saving easier
- Updated the the Photo object for user annotations
- THEN: Init user annotation UI from photo place data

### 2022-05-27
- Added pending/error handling for GPS loading
- NEXT: Init user annotation UI from photo place data
- THEN: Update the the Photo object for user annotations

### 2022-05-25
- Completed GPS autofill
- NEXT: Add pending/error handling for GPS loading
- THEN: Save the user annotations


### 2022-05-22
- Got the place data inputs all hooked up
- NEXT: Auto populate location from query
- THEN: Save the user annotations
- THEN: tag people
- THEN: think about bulk actions -> select/unselect, export, edit, move, delete
- THEN: filter/search by location, tags, people, title, description, date range
- THEN: view by subdirectory
- Trying `iso 3166` package
- Getting countries/country codes
  - Using built-in `Intl.DisplayNames()` [stackoverflow](https://stackoverflow.com/questions/29919596/how-do-i-get-a-list-of-countries-in-my-website)
    - [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames)
  - [countries-list package](https://www.npmjs.com/package/countries-list)
  - [incredimike/variousCountryListFormats.js](https://gist.github.com/incredimike/1469814)- bunch of js array/object for different formats
  - [package of countries and states](https://www.npmjs.com/package/iso3166-2-db)


### 2022-05-20
- Finish tag annotation UI
- Question?- get country, state/province, city from gps coordinates
  - [Google geocoding](https://developers.google.com/maps/documentation/javascript/geocoding?hl=en)
  - [Open Cage](https://opencagedata.com/pricing)
  - [BigDataCloud](https://www.bigdatacloud.com/blog/convert-getcurrentposition-free-reversegeocoding-api)
    - Free????
    - `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=37.42159&longitude=-122.0837&localityLanguage=en`
    - `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=48.8566&longitude=2.3522&localityLanguage=en`

### 2022-05-19
- Working on tag user annotation

### 2022-05-18
- Starting user input for annotations
- installing gestalt date picker
  - `npm i gestalt-datepicker --save`

### 2022-05-17
- Finished defining types for metadata
- Finished displaying metadata
- Nextup: fields for user annotation
  - Title
  - Description
  - People
  - tags/Keywords
  - Location details
  - Date
- TODO: If I figure out how to annotate specific areas of a photo this should happen in a different view. The current <PhotoView /> is too small to view data and annotate on the image

### 2022-05-10
- Start closeup view

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
  - Figure out gallery view ✅
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
3. Display the images and metadata ✅
4. Collect user input
5. Write the data to a file
### 2022-05-03
- Question: how to get metadata from photos themselves?
  - https://techsparx.com/nodejs/graphics/image-metadata.html
  - https://auth0.com/blog/read-edit-exif-metadata-in-photos-with-javascript/


What do I want this app to do?
- Display images
  - handle rotating images if annotated as such
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
- Search for photos by people, description, place, etc
- Summary based on annotations
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
