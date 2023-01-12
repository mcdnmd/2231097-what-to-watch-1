import {FilmPerson} from './filmPerson.type.js';
import {GenreEnum} from './genre.enum.js';
import {User} from './user.type.js';

export type Film = {
  isPromo?: boolean;
  title: string;
  description: string;
  publicationDate: Date;
  genre: GenreEnum;
  releaseYear: number;
  rating: number;
  previewPath: string;
  moviePath: string;
  actors: FilmPerson[];
  producer: FilmPerson;
  durationInMinutes: number;
  commentsCount: number;
  user: User;
  posterPath: string;
  backgroundImagePath: string;
  backgroundColor: string;
}
