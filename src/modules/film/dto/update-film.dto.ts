import {GenreEnum} from '../../../types/genre.enum';

export default class UpdateFilmDto {
  name!: string;
  description!: string;
  pubDate!: Date;
  genre!: GenreEnum[];
  year!: number;
  rating!: number;
  preview!: string;
  video!: string;
  actors!: string[];
  producer!: string;
  duration!: number;
  commentNumber!: number;
  user!: string;
  poster!: string;
  backgroundImage!: string;
  backgroundColor!: string;
}
