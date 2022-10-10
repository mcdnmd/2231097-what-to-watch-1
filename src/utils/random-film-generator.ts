import {MockedFilms} from '../types/mocked-film.type';
import {GenreEnum} from '../types/genre.enum';
import {getRandomItem, getRandomItems} from './random-items.js';

export default class RandomFilmGenerator {
  constructor(private readonly mockedData: MockedFilms ) {}

  public generate() : string {
    const name = getRandomItem<string>(this.mockedData.names);
    const description = getRandomItem<string>(this.mockedData.descriptions);
    const pubDate = new Date();
    const genre = <GenreEnum>getRandomItem(this.mockedData.genres);
    const year = getRandomItem<number>(this.mockedData.years);
    const rating = getRandomItem<number>(this.mockedData.ratings);
    const preview = getRandomItem<string>(this.mockedData.previews);
    const video = getRandomItem<string>(this.mockedData.videos);
    const actors = getRandomItems<string>(this.mockedData.actors).join(';');
    const producer = getRandomItem<string>(this.mockedData.producers);
    const duration = getRandomItem(this.mockedData.movieDurations);
    const userName = getRandomItem<string>(this.mockedData.userNames);
    const userEmail = getRandomItem<string>(this.mockedData.userEmails);
    const avatarPath = getRandomItem<string>(this.mockedData.avatarPaths);
    const poster = getRandomItem<string>(this.mockedData.posterPaths);
    const backgroundImage = getRandomItem<string>(this.mockedData.backgroundImages);
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
      [userName, userEmail, avatarPath].join(';'),
      poster,
      backgroundImage,
      backgroundColor,
    ].join('\t');
  }
}
