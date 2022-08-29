interface PersonData {
  id: string;
  description: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export default class Person {
  id: string;

  description: string;

  firstName: string;

  lastName: string;

  middleName: string;

  constructor(data: PersonData) {
    this.id = data.id;
    this.description = data.description;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.middleName = data.middleName;
  }
}
