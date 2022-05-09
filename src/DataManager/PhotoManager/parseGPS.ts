import piexif from 'piexifjs';

/**
 * GPSLatitude and GPSLongitude in the raw exif data are arrays of six numbers.
 * They form the numerators and denominators for three rational values
 * representing a coordinate in terms of degrees, minutes, and seconds:
 */
function convertCoordinateArrayToDecimal(
  arr: [number[]],
  ref: 'N' | 'S' | 'E' | 'W'
): number | null {
  if (!arr || !ref) {
    return null;
  }

  const multiplier = ['N', 'E'].includes(ref) ? 1 : -1;

  // Good for rendering in google maps
  // ex)
  // const url = `https://www.google.com/maps?q=${decimalLatitude},${decimalLongitude}`;
  return multiplier * piexif.GPSHelper.dmsRationalToDeg(arr);
}

/**
 * Given a numerator/denominator pair expressed as a 2-element array,
 * return it as a single numeric value
 */
function rationalToDecimal(rationalValue: [number, number]) {
  return rationalValue[0] / rationalValue[1];
}

function convertAltitudeToDecimalMeters(
  altitudeArr: [number, number],
  altitudeRef: 0 | 1
): number | null {
  if (!altitudeArr) {
    return null;
  }

  // `0` represents above sea level
  const multiplier = altitudeRef ? -1 : 1;
  return multiplier * rationalToDecimal(altitudeArr);
}

/**
 * Convert a numeric compass heading to the nearest
 * cardinal, ordinal, or secondary intercardinal direction
 */
function degreesToDirection(degrees: number) {
  const COMPASS_DIRECTIONS = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];

  const compassDirectionsCount = COMPASS_DIRECTIONS.length;
  const compassDirectionArc = 360 / compassDirectionsCount;
  return COMPASS_DIRECTIONS[
    Math.round(degrees / compassDirectionArc) % compassDirectionsCount
  ];
}

function parseDirection(
  directionArr: [number, number],
  directionRef: 'T' | 'M'
) {
  if (!directionArr) {
    return null;
  }

  const directionDecimal = directionArr[0] / directionArr[1];

  // directionRef - True north or Magnetic north
  return {
    cardinal: degreesToDirection(directionDecimal),
    degrees: directionDecimal,
    reference: directionRef,
  };
}

function parseSpeed(speedArr: [number, number], units: 'K' | 'N' | 'M') {
  if (!speedArr) {
    return null;
  }

  // Units are kilometers/h, miles/h, or knots
  return { speed: rationalToDecimal(speedArr), units };
}

export default function parseGPS(rawGPS: Record<string, any>) {
  const latitude = convertCoordinateArrayToDecimal(
    rawGPS[piexif.GPSIFD.GPSLatitude],
    rawGPS[piexif.GPSIFD.GPSLatitudeRef]
  );

  const longitude = convertCoordinateArrayToDecimal(
    rawGPS[piexif.GPSIFD.GPSLongitude],
    rawGPS[piexif.GPSIFD.GPSLongitudeRef]
  );

  const altitude = convertAltitudeToDecimalMeters(
    rawGPS[piexif.GPSIFD.GPSAltitude],
    rawGPS[piexif.GPSIFD.GPSAltitudeRef]
  );

  const direction = parseDirection(
    rawGPS[piexif.GPSIFD.GPSImgDirection],
    rawGPS[piexif.GPSIFD.GPSImgDirectionRef]
  );

  const speed = parseSpeed(
    rawGPS[piexif.GPSIFD.GPSSpeed],
    rawGPS[piexif.GPSIFD.GPSSpeedRef]
  );

  return {
    raw: rawGPS,
    parsed: { latitude, longitude, altitude, direction, speed },
  };
}
