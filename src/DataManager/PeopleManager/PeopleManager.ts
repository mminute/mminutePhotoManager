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

  updatePerson(updateData: NewPersonData) {
    const personToUpdate = this.people.find((p) => p.id === updateData.id);

    if (personToUpdate) {
      personToUpdate.update({
        description: updateData.description,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        middleName: updateData.middleName,
      });
    }
  }

  deletePerson(targetId: string) {
    this.people = this.people.filter((p) => p.id !== targetId);
  }
}
