// https://github.com/hMatoba/piexifjs/blob/master/piexif.js
import { Tuple, UndefinedType, Byte } from './basicTypes';

export type Speeds = 'K' | 'M' | 'N';

export interface GpsMetadata {
  parsed: {
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    direction: null | {
      cardinal: string;
      degrees: number;
      reference: string;
    };
    speed: null | {
      speed: number;
      units: Speeds;
    };
  };
  raw: {
    GPSVersionID?: Byte;
    GPSLatitudeRef?: string;
    GPSLatitude?: [Tuple, Tuple, Tuple];
    GPSLongitudeRef?: string;
    GPSLongitude?: [Tuple, Tuple, Tuple];
    GPSAltitudeRef?: Byte;
    GPSAltitude?: Tuple;
    GPSTimeStamp?: [Tuple, Tuple, Tuple];
    GPSSpeedRef?: Speeds;
    GPSSpeed?: Tuple;
    GPSImgDirectionRef?: string;
    GPSImgDirection?: Tuple;
    GPSDestBearingRef?: string;
    GPSDestBearing?: Tuple;
    GPSDateStamp?: string;
    GPSHPositioningError?: Tuple;
    GPSSatellites?: string;
    GPSStatus?: string;
    GPSMeasureMode?: string;
    GPSDOP?: Tuple;
    GPSTrackRef?: string;
    GPSTrack?: string;
    GPSMapDatum?: string;
    GPSDestLatitudeRef?: string;
    GPSDestLatitude?: Tuple;
    GPSDestLongitudeRef?: string;
    GPSDestLongitude?: Tuple;
    GPSDestDistanceRef?: string;
    GPSDestDistance?: Tuple;
    GPSProcessingMethod?: UndefinedType;
    GPSAreaInformation?: UndefinedType;
    GPSDifferential?: number;
  };
}
