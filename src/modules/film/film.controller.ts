import {Controller} from '../../common/controller/controller';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types';
import {LoggerInterface} from '../../common/logger/logger.interface';
import FilmService from './film.service';
import {FilmRoute} from './film.models';
import {HttpMethod} from '../../types/http-method.enum';
import {Request, Response} from 'express';
import {fillDTO} from '../../utils/common-functions.js';
import FilmResponse from './response/film.response';
import CreateFilmDto from './dto/create-film.dto';
import UpdateFilmDto from './dto/update-film.dto';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../common/errors/http-error';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.LoggerInterface) private readonly filmService: FilmService,
  ) {
    super(logger);
    this.logger.info('Register routes for FilmController.');
    this.addRoute<FilmRoute>({path: FilmRoute.ROOT, method: HttpMethod.Get, handler: this.index});
    this.addRoute<FilmRoute>({path: FilmRoute.CREATE, method: HttpMethod.Post, handler: this.create});
    this.addRoute<FilmRoute>({path: FilmRoute.MOVIE, method: HttpMethod.Get, handler: this.getFilm});
    this.addRoute<FilmRoute>({path: FilmRoute.MOVIE, method: HttpMethod.Patch, handler: this.updateFilm});
    this.addRoute<FilmRoute>({path: FilmRoute.MOVIE, method: HttpMethod.Delete, handler: this.deleteFilm});
    this.addRoute<FilmRoute>({path: FilmRoute.PROMO, method: HttpMethod.Get, handler: this.getFilm});
  }

  async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();
    this.ok(res, fillDTO(FilmResponse, films));
  }

  async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateFilmDto>, res: Response): Promise<void> {
    const result = await this.filmService.create(body);
    this.created(res, fillDTO(FilmResponse, result));
  }

  async getFilm({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const result = await this.filmService.findById(`${params.filmId}`);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async updateFilm({params, body}: Request<Record<string, string>,
    Record<string, unknown>, UpdateFilmDto>, res: Response): Promise<void> {
    const film = await this.filmService.findById(params.filmId);
    if (!film){
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильма с id «${params.filmId}» не существует.`, 'FilmController');
    }
    const result = await this.filmService.updateById(params.filmId, body);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async deleteFilm({params}: Request<Record<string, string>>, res: Response): Promise<void> {
    const film = await this.filmService.findById(params.filmId);
    if (!film){
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильма с id «${params.filmId}» не существует.`, 'FilmController');
    }
    await this.filmService.deleteById(`${params.filmId}`);
    this.noContent(res, {message: 'Фильм успешно удален.'});
  }

  async getPromo(_: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();
    this.ok(res, fillDTO(FilmResponse, result));
  }
}
