import {Film} from '../types/film.type.js';
import {FilmPerson} from '../types/filmPerson.type.js';
import {User} from '../types/user.type.js';
import {GenreEnum} from '../types/genre.enum.js';

function getUser(user: string): User {
  const divided = user.split(';');
  const email = divided.at(0) ?? '';
  const avatarPath = divided.at(1) ?? '';
  const firstname = divided.at(2) ?? '';
  const lastname = divided.at(3) ?? '';
  return {email, avatarPath, firstname, lastname};
}

function getFilmPerson(filmPerson: string): FilmPerson {
  const divided = filmPerson.split(' ');
  const firstname = divided.at(0) ?? '';
  const lastname = divided.at(0);
  return {firstname, lastname};
}

function getGenres(genre: string): GenreEnum[] {
  return  genre.split(';').map((item): GenreEnum => item as GenreEnum);
}

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
  return {
    name: name,
    description: description,
    pubDate: new Date(Date.parse(pubDate)),
    genre: getGenres(genre),
    year: Number(year),
    rating: Number(rating),
    preview: preview,
    video,
    actors: actors.split(';').map((item) : FilmPerson => getFilmPerson(item)),
    producer: getFilmPerson(producer),
    duration: Number(duration),
    commentNumber: Number(commentNumber),
    user: getUser(user),
    poster: poster,
    backgroundImage: backgroundImg,
    backgroundColor: backgroundColor};
};
