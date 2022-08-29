import Person from './Person';

export interface NewPersonData {
  description: string;
  firstName: string;
  id: string;
  lastName: string;
  middleName: string;
}

export default class PeopleManager {
  people: Person[] = [];

  initialize(data: Person[]) {
    this.people = data.map((p) => new Person(p));
  }

  createPerson(newPersonData: NewPersonData) {
    this.people.push(new Person(newPersonData));
  }
}
