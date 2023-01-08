import {User} from './user.type.js';
import {FilmPerson} from './filmPerson.type.js';
import {GenreEnum} from './genre.enum.js';

export type Film = {
  isPromo?: boolean;
  name: string;
  description: string;
  pubDate: Date;
  genre: GenreEnum[];
  year: number;
  rating: number;
  preview: string;
  video: string;
  actors: FilmPerson[];
  producer: FilmPerson;
  duration: number;
  commentNumber: number;
  user: User;
  poster: string;
  backgroundImage: string;
  backgroundColor: string;
}
