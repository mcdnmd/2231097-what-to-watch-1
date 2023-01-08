import {Film} from '../types/film.type.js';
import {FilmPerson} from '../types/filmPerson.type.js';
import {User} from '../types/user.type.js';
import {GenreEnum} from '../types/genre.enum.js';

function getUser(user: string): User {
  const [email, avatarPath, firstName, lastName] = user.split(';');

  return {
    email: email ?? '',
    avatarPath: avatarPath ?? '',
    firstName: firstName ?? '',
    lastName: lastName ?? ''
  };
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
    title: name,
    description: description,
    publicationDate: new Date(Date.parse(pubDate)),
    genre: getGenres(genre),
    releaseYear: Number(year),
    rating: Number(rating),
    previewPath: preview,
    moviePath: video,
    actors: actors.split(';').map((item) : FilmPerson => getFilmPerson(item)),
    producer: getFilmPerson(producer),
    durationInMinutes: Number(duration),
    commentsCount: Number(commentNumber),
    user: getUser(user),
    posterPath: poster,
    backgroundImagePath: backgroundImg,
    backgroundColor: backgroundColor};
};
