import UserAnnotationPlace from './UserAnnotationPlace';

interface UserAnnotations {
  date: string;
  description: string;
  place: UserAnnotationPlace;
  tags: string[];
  title: string;
  // TODO: people
}

export default class UserAnnotationData {
  date: string;

  description: string;

  place: UserAnnotationPlace;

  tags: string[];

  title: string;

  constructor({ date, description, place, tags, title }: UserAnnotations) {
    this.date = date;
    this.description = description;
    this.place = place;
    this.tags = tags;
    this.title = title;
  }
}
