import {CliCommandInterface} from './cli-command.interface.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import chalk from 'chalk';
import {createFilm} from '../utils/film-constructor.js';
import {UserServiceInterface} from '../modules/user/user-service.interface.js';
import {FilmServiceInterface} from '../modules/film/film-service.interface.js';
import {DatabaseInterface} from '../common/database-client/database.interface.js';
import LoggerService from '../common/logger/logger.service.js';
import FilmService from '../modules/film/film.service.js';
import {FilmModel} from '../modules/film/film.entity.js';
import {UserModel} from '../modules/user/user.entity.js';
import DatabaseService from '../common/database-client/database.service.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import UserService from '../modules/user/user.service.js';
import {getURI} from '../utils/db.js';
import {Film} from '../types/film.type';
import {ConfigInterface} from '../common/config/config.interface.js';
import ConfigService from '../common/config/config.service.js';


export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private readonly logger!: LoggerInterface;
  private userService!: UserServiceInterface;
  private config!: ConfigInterface;
  private filmService!: FilmServiceInterface;
  private databaseService!: DatabaseInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new LoggerService();
    this.filmService = new FilmService(this.logger, FilmModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
    this.config = new ConfigService(this.logger);
  }

  async execute(filename: string): Promise<void> {
    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'));
    this.salt = this.config.get('SALT');

    await this.databaseService.connect(uri);
    const fileReader = new TsvFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);
    try {
      await fileReader.read();
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(chalk.bgRed(chalk.black(`Catched an error: ${chalk.red(err.message)}`)));
      }
    }
    return Promise.resolve();
  }

  private async saveFilm(film: Film) {
    const user = await this.userService.findOrCreate({...film.user, password: '1234567890'}, this.salt);
    const filmEntity = {
      name: film.name,
      description: film.description,
      pubDate: film.pubDate,
      genre: film.genre,
      year: film.year,
      rating: film.rating,
      preview: film.preview,
      video: film.video,
      actors: film.actors.map((actor) => `${actor.firstname} ${actor.lastname}`),
      producer: `${film.producer.firstname} ${film.producer.lastname}`,
      duration: film.duration,
      commentNumber: film.commentNumber,
      user: user.id,
      poster: film.poster,
      backgroundImage: film.backgroundImage,
      backgroundColor: film.backgroundColor,
    };
    await this.filmService.create({...filmEntity});
  }

  private async onLine(line: string, resolve: () => void) {
    const movie = createFilm(line);
    await this.saveFilm(movie);
    this.logger.info(`Сохранили фильм ${JSON.stringify(movie)}`);
    resolve();
  }

  private async onComplete(count: number) {
    this.logger.info(`${count} строк было прочитано.`);
    await this.databaseService.disconnect();
  }
}
