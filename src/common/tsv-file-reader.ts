import {FileReaderInterface} from './file-reader.interface.js';
import {readFileSync} from 'fs';
import {Film} from '../entities/film.js';
import {Actor} from '../entities/actor.js';
import chalk from 'chalk';

export default class TsvFileReader implements FileReaderInterface {
  private rawData = '';
  private columns: string[] = [];

  constructor(public filename: string) {}

  public read() {
    this.rawData = readFileSync(this.filename, 'utf-8');
    this.findColumnsInFile();
  }

  private findColumnsInFile(): void {
    const separatedData = this.rawData.split('\n');
    const columnsString =  separatedData[0];
    const indexEndOfColumns = columnsString.length;
    this.columns = separatedData[0].split('\t');
    this.rawData = this.rawData.slice(indexEndOfColumns);
  }

  public toArray(): Film[] {
    if (!this.rawData) {
      return [];
    }
    console.log(chalk.red('TSV columns'), chalk.bgBlack(this.columns));
    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([name,
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
        backgroundColor]) => new Film(
        name,
        description,
        new Date(Date.parse(pubDate)),
        genre.split(';'),
        Number(year),
        Number(rating),
        preview,
        video,
        actors.split(';').map((item) => {
          const splitString = item.slice();
          return new Actor(splitString.at(0), splitString.at(1));
        }),
        producer,
        Number(duration),
        Number(commentNumber),
        user,
        poster,
        backgroundImg,
        backgroundColor)
      );
  }
}
