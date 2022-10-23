import {Film} from '../entities/film.js';
import {Actor} from '../entities/actor.js';
import {User} from '../entities/user.js';

export const createFilm = (line: string): Film => {
  const [name,
    description,
    pubDate,
    genre,
    year,
    rating,
    preview,
    video,
    actors,
    producer,
    duration,
    commentNumber,
    user,
    poster,
    backgroundImg,
    backgroundColor] = line.replace('\n', '').split('\t');
  const [userName, email, avatar, password] = user.split(';');
  return new Film(
    name,
    description,
    new Date(Date.parse(pubDate)),
    genre.split(';'),
    Number(year),
    Number(rating),
    preview,
    video,
    actors.split(';').map((item) => {
      const splitString = item.split(' ');
      if (splitString.length > 1) {
        return new Actor(splitString.at(0), splitString.at(1));
      } else {
        return new Actor(item);
      }
    }),
    producer,
    Number(duration),
    Number(commentNumber),
    new User(userName, email, avatar, password),
    poster,
    backgroundImg,
    backgroundColor);
};
