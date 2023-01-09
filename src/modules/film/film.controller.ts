import {Controller} from '../../common/controller/controller.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import * as core from 'express-serve-static-core';
import {FilmRoute} from './film.models.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import {fillDTO} from '../../utils/common-functions.js';
import FilmResponse from './response/film.response.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import {FilmServiceInterface} from './film-service.interface.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../middlewares/validate-object-id.middleware.js';
import CommentResponse from '../comment/response/comment.response.js';
import {DocumentExistsMiddleware} from '../../middlewares/document-exists.middleware.js';

type ParamsGetFilm = {
  filmId: string;
}


@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);
    this.logger.info('Register routes for FilmController.');
    console.log(filmService);
    this.addRoute<FilmRoute>({path: FilmRoute.PROMO, method: HttpMethod.Get, handler: this.showPromo});
    this.addRoute<FilmRoute>({
      path: FilmRoute.CREATE,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateFilmDto)]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.FILM,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute<FilmRoute>({path: FilmRoute.ROOT, method: HttpMethod.Get, handler: this.index});
    this.addRoute<FilmRoute>({
      path: FilmRoute.FILM,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.FILM,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
    this.addRoute<FilmRoute>({
      path: FilmRoute.COMMENTS,
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
  }

  async index(_req: Request, res: Response): Promise<void> {
    console.log(`/movies  this.filmService is ${typeof(this.filmService)}`);
    const films = await this.filmService.find();
    this.ok(res, fillDTO(FilmResponse, films));
  }

  async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateFilmDto>, res: Response): Promise<void> {
    const result = await this.filmService.create(body);
    this.created(res, fillDTO(FilmResponse, result));
  }

  async show({params}: Request<core.ParamsDictionary | ParamsGetFilm>, res: Response): Promise<void> {
    console.log(`/movies/${params.filmId}: this.filmService is ${typeof(this.filmService)}`);
    const result = await this.filmService.findById(params.filmId);
    if (!result) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id '${params.filmId}' was not found`, 'MovieController');
    }
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async update(
    {params, body}: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, UpdateFilmDto>,
    res: Response): Promise<void> {
    const film = await this.filmService.findById(params.filmId);
    if (!film){
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильма с id «${params.filmId}» не существует.`, 'FilmController');
    }
    const result = await this.filmService.updateById(params.filmId, body);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async delete({params}: Request<core.ParamsDictionary | ParamsGetFilm>, res: Response): Promise<void> {
    const film = await this.filmService.findById(params.filmId);
    if (!film){
      throw new HttpError(StatusCodes.NOT_FOUND, `Фильма с id «${params.filmId}» не существует.`, 'FilmController');
    }
    await this.filmService.deleteById(`${params.filmId}`);
    this.noContent(res, {message: 'Фильм успешно удален.'});
  }

  async showPromo(_: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();
    this.ok(res, fillDTO(FilmResponse, result));
  }

  async getComments({params}: Request<core.ParamsDictionary | ParamsGetFilm>, res: Response): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
