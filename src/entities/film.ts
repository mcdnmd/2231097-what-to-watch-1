import {Length} from 'class-validator';
import {Actor} from './actor.js';

export class Film {
  @Length(2,100)
  public name: string;

  public description: string;
  public pubDate: Date;
  public genre: Array<string>;
  public year: number;
  public rating: number;
  public preview: string;
  public video: string;
  public actors: Actor[];
  public producer: string;
  public duration: number;
  public commentNumber: number;
  public user: string;
  public poster: string;
  public backgroundImg: string;
  public backgroundColor: string;
  constructor(
    name: string,
    description: string,
    pubDate: Date,
    genre: Array<string>,
    year: number,
    rating: number,
    preview: string,
    video: string,
    actors: Actor[],
    producer: string,
    duration: number,
    commentNumber: number,
    user: string,
    poster: string,
    backgroundImg: string,
    backgroundColor: string) {
    this.name = name;
    this.description = description;
    this.pubDate = pubDate;
    this.genre = genre;
    this.year = year;
    this.rating = rating;
    this.preview = preview;
    this.video = video;
    this.actors = actors;
    this.producer = producer;
    this.duration = duration;
    this.commentNumber = commentNumber;
    this.user = user;
    this.poster = poster;
    this.backgroundImg = backgroundImg;
    this.backgroundColor = backgroundColor;
  }
}
