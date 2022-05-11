interface PlaceObject {
  label: string;
  value: string | null;
}

interface Args {
  city: string;
  country: PlaceObject;
  name: string;
  stateProvince: PlaceObject;
}

export default class UserAnnotationPlace {
  city: string;

  country: PlaceObject;

  name: string;

  stateProvince: PlaceObject;

  constructor({ name, country, stateProvince, city }: Args) {
    this.city = city;
    this.country = country;
    this.name = name;
    this.stateProvince = stateProvince;
  }
}
