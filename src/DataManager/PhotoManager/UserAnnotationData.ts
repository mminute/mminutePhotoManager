import UserAnnotationPlace from './UserAnnotationPlace';

interface UserAnnotations {
  date: string;
  description: string;
  place: UserAnnotationPlace;
  tags: string[];
  title: string;
  people: string[];
}

export default class UserAnnotationData {
  date: string;

  description: string;

  place: UserAnnotationPlace;

  tags: string[];

  title: string;

  people: string[];

  constructor({
    date,
    description,
    people,
    place,
    tags,
    title,
  }: UserAnnotations) {
    this.date = date;
    this.description = description;
    this.people = people;
    this.place = place;
    this.tags = tags;
    this.title = title;
  }
}
