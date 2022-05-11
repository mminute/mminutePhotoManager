// https://github.com/hMatoba/piexifjs/blob/master/piexif.js

import { Tuple } from './basicTypes';

export interface ExifMetadata {
  ApertureValue?: Tuple;
  BrightnessValue?: Tuple;
  ColorSpace?: number;
  ComponentsConfiguration?: string;
  CustomRendered?: number;
  DateTimeDigitized?: string;
  DateTimeOriginal?: string;
  ExifVersion?: string;
  ExposureBiasValue?: Tuple;
  ExposureMode?: number;
  ExposureProgram?: number;
  ExposureTime?: Tuple;
  FNumber?: Tuple;
  Flash?: number;
  FlashpixVersion?: string;
  FocalLength?: Tuple;
  FocalLengthIn35mmFilm?: number;
  ISOSpeedRatings?: number;
  LensMake?: string;
  LensModel?: string;
  LensSpecification?: [Tuple, Tuple, Tuple, Tuple];
  MakerNote?: string;
  MeteringMode?: number;
  PixelXDimension?: number;
  PixelYDimension?: number;
  SceneCaptureType?: number;
  SceneType?: string;
  SensingMethod?: number;
  ShutterSpeedValue?: Tuple;
  SubSecTimeDigitized?: string;
  SubSecTimeOriginal?: string;
  SubjectArea?: [number, number, number, number]; // piexif types as 'Short'
  WhiteBalance?: number;
  SpectralSensitivity?: string;
  OECF?: undefined;
  SensitivityType?: number;
  StandardOutputSensitivity?: number;
  RecommendedExposureIndex?: number;
  ISOSpeed?: number;
  ISOSpeedLatitudeyyy?: number;
  ISOSpeedLatitudezzz?: number;
  CompressedBitsPerPixel?: Tuple;
  MaxApertureValue?: Tuple;
  SubjectDistance?: Tuple;
  LightSource?: number;
  UserComment?: string;
  SubSecTime?: string;
  RelatedSoundFile?: string;
  InteroperabilityTag?: number;
  FlashEnergy?: Tuple;
  SpatialFrequencyResponse?: any; // piexif typea as 'Undefined'
  FocalPlaneXResolution?: Tuple;
  FocalPlaneYResolution?: Tuple;
  FocalPlaneResolutionUnit?: number;
  SubjectLocation?: number;
  ExposureIndex?: Tuple;
  FileSource?: any; // piexif typea as 'Undefined'
  CFAPattern?: any; // piexif typea as 'Undefined'
  DigitalZoomRatio?: Tuple;
  GainControl?: number;
  Contrast?: number;
  Saturation?: number;
  Sharpness?: number;
  DeviceSettingDescription?: any; // piexif typea as 'Undefined'
  SubjectDistanceRange?: number;
  ImageUniqueID?: string;
  CameraOwnerName?: string;
  BodySerialNumber?: string;
  LensSerialNumber?: string;
  Gamma?: Tuple;
}
