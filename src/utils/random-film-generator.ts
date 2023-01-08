import {MockedFilms} from '../types/mocked-film.type.js';
import {GenreEnum} from '../types/genre.enum.js';
import {getRandomItem, getRandomItems} from './random-items.js';

export default class RandomFilmGenerator {
  constructor(private readonly mockedData: MockedFilms ) {}

  public generate() : string {
    const name = getRandomItem<string>(this.mockedData.titles);
    const description = getRandomItem<string>(this.mockedData.descriptions);
    const pubDate = new Date();
    const genre = <GenreEnum>getRandomItem(this.mockedData.genres);
    const year = getRandomItem<number>(this.mockedData.releaseYears);
    const rating = getRandomItem<number>(this.mockedData.ratings);
    const preview = getRandomItem<string>(this.mockedData.previewPaths);
    const video = getRandomItem<string>(this.mockedData.moviePaths);
    const actors = getRandomItems<string>(this.mockedData.actors).join(';');
    const producer = getRandomItem<string>(this.mockedData.producers);
    const duration = getRandomItem(this.mockedData.movieDurationSInMinutes);
    const userName = getRandomItem<string>(this.mockedData.userNames);
    const userLastName = getRandomItem<string>(this.mockedData.userLastNames);
    const userEmail = getRandomItem<string>(this.mockedData.userEmails);
    const avatarPath = getRandomItem<string>(this.mockedData.avatarPaths);
    const poster = getRandomItem<string>(this.mockedData.posterPaths);
    const backgroundImage = getRandomItem<string>(this.mockedData.backgroundImagePaths);
    const backgroundColor = getRandomItem<string>(this.mockedData.backgroundColors);

    return [
      name,
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
      0,
      [userEmail, avatarPath, userName, userLastName].join(';'),
      poster,
      backgroundImage,
      backgroundColor,
    ].join('\t');
  }
}
