import Person from 'DataManager/PeopleManager/Person';

export default function makePersonName(personData: Person) {
  return [personData.firstName, personData.middleName, personData.lastName]
    .filter(Boolean)
    .join(' ');
}
