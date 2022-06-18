// https://github.com/hMatoba/piexifjs/blob/master/piexif.js

import { Tuple, UndefinedType, Byte } from './basicTypes';

export interface ImageMetadata {
  Make?: string;
  Model?: string;
  Orientation?: number;
  XResolution?: Tuple;
  YResolution?: Tuple;
  ResolutionUnit?: number;
  Software?: string;
  DateTime?: string;
  YCbCrPositioning?: number;
  ExifTag?: number;
  GPSTag?: number;
  ProcessingSoftware?: string;
  NewSubfileType?: number;
  SubfileType?: number;
  ImageWidth?: number;
  ImageLength?: number;
  BitsPerSample?: number;
  Compression?: number;
  PhotometricInterpretation?: number;
  Threshholding?: number;
  CellWidth?: number;
  CellLength?: number;
  FillOrder?: number;
  DocumentName?: string;
  ImageDescription?: string;
  StripOffsets?: number;
  SamplesPerPixel?: number;
  RowsPerStrip?: number;
  StripByteCounts?: number;
  PlanarConfiguration?: number;
  GrayResponseUnit?: number;
  GrayResponseCurve?: number;
  T4Options?: number;
  T6Options?: number;
  TransferFunction?: number;
  Artist?: string;
  HostComputer?: string;
  Predictor?: number;
  WhitePoint?: Tuple;
  PrimaryChromaticities?: Tuple;
  ColorMap?: number;
  HalftoneHints?: number;
  TileWidth?: number;
  TileLength?: number;
  TileOffsets?: number;
  TileByteCounts?: number;
  SubIFDs?: number;
  InkSet?: number;
  InkNames?: string;
  NumberOfInks?: number;
  DotRange?: Byte;
  TargetPrinter?: string;
  ExtraSamples?: number;
  SampleFormat?: number;
  SMinSampleValue?: number;
  SMaxSampleValue?: number;
  TransferRange?: number;
  ClipPath?: Byte;
  XClipPathUnits?: number;
  YClipPathUnits?: number;
  Indexed?: number;
  JPEGTables?: UndefinedType;
  OPIProxy?: number;
  JPEGProc?: number;
  JPEGInterchangeFormat?: number;
  JPEGInterchangeFormatLength?: number;
  JPEGRestartInterval?: number;
  JPEGLosslessPredictors?: number;
  JPEGPointTransforms?: number;
  JPEGQTables?: number;
  JPEGDCTables?: number;
  JPEGACTables?: number;
  YCbCrCoefficients?: Tuple;
  YCbCrSubSampling?: number;
  ReferenceBlackWhite?: Tuple;
  XMLPacket?: Byte;
  Rating?: number;
  RatingPercent?: number;
  ImageID?: string;
  CFARepeatPatternDim?: number;
  CFAPattern?: Byte;
  BatteryLevel?: Tuple;
  Copyright?: string;
  ExposureTime?: Tuple;
  ImageResources?: Byte;
  InterColorProfile?: UndefinedType;
  Interlace?: number;
  TimeZoneOffset?: number;
  SelfTimerMode?: number;
  FlashEnergy?: Tuple;
  SpatialFrequencyResponse?: UndefinedType;
  Noise?: UndefinedType;
  FocalPlaneXResolution?: Tuple;
  FocalPlaneYResolution?: Tuple;
  FocalPlaneResolutionUnit?: number;
  ImageNumber?: number;
  SecurityClassification?: string;
  ImageHistory?: string;
  ExposureIndex?: Tuple;
  TIFFEPStandardID?: Byte;
  SensingMethod?: number;
  XPTitle?: Byte;
  XPComment?: Byte;
  XPAuthor?: Byte;
  XPKeywords?: Byte;
  XPSubject?: Byte;
  PrintImageMatching?: UndefinedType;
  DNGVersion?: Byte;
  DNGBackwardVersion?: Byte;
  UniqueCameraModel?: string;
  LocalizedCameraModel?: Byte;
  CFAPlaneColor?: Byte;
  CFALayout?: number;
  LinearizationTable?: number;
  BlackLevelRepeatDim?: number;
  BlackLevel?: Tuple;
  BlackLevelDeltaH?: Tuple;
  BlackLevelDeltaV?: Tuple;
  WhiteLevel?: number;
  DefaultScale?: Tuple;
  DefaultCropOrigin?: number;
  DefaultCropSize?: number;
  ColorMatrix1?: Tuple;
  ColorMatrix2?: Tuple;
  CameraCalibration1?: Tuple;
  CameraCalibration2?: Tuple;
  ReductionMatrix1?: Tuple;
  ReductionMatrix2?: Tuple;
  AnalogBalance?: Tuple;
  AsShotNeutral?: number;
  AsShotWhiteXY?: Tuple;
  BaselineExposure?: Tuple;
  BaselineNoise?: Tuple;
  BayerGreenSplit?: number;
  LinearResponseLimit?: Tuple;
  CameraSerialNumber?: string;
  LensInfo?: Tuple;
  ChromaBlurRadius?: Tuple;
  AntiAliasStrength?: Tuple;
  ShadowScale?: Tuple;
  UndefinedType?: Byte;
  MakerNoteSafety?: number;
  CalibrationIlluminant1?: number;
  CalibrationIlluminant2?: number;
  BestQualityScale?: Tuple;
  RawDataUniqueID?: Byte;
  OriginalRawFileName?: Byte;
  OriginalRawFileData?: UndefinedType;
  ActiveArea?: number;
  MaskedAreas?: number;
  AsShotICCProfile?: UndefinedType;
  AsShotPreProfileMatrix?: Tuple;
  CurrentICCProfile?: UndefinedType;
  CurrentPreProfileMatrix?: Tuple;
  ColorimetricReference?: number;
  CameraCalibrationSignature?: Byte;
  ProfileCalibrationSignature?: Byte;
  AsShotProfileName?: Byte;
  NoiseReductionApplied?: Tuple;
  ProfileName?: Byte;
  ProfileHueSatMapDims?: number;
  ProfileHueSatMapData1?: number;
  ProfileHueSatMapData2?: number;
  ProfileToneCurve?: number;
  ProfileEmbedPolicy?: number;
  ProfileCopyright?: Byte;
  ForwardMatrix1?: Tuple;
  ForwardMatrix2?: Tuple;
  PreviewApplicationName?: Byte;
  PreviewApplicationVersion?: Byte;
  PreviewSettingsName?: Byte;
  PreviewSettingsDigest?: Byte;
  PreviewColorSpace?: number;
  PreviewDateTime?: string;
  RawImageDigest?: UndefinedType;
  OriginalRawFileDigest?: UndefinedType;
  SubTileBlockSize?: number;
  RowInterleaveFactor?: number;
  ProfileLookTableDims?: number;
  ProfileLookTableData?: number;
  OpcodeList1?: UndefinedType;
  OpcodeList2?: UndefinedType;
  OpcodeList3?: UndefinedType;
}
