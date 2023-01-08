import {Controller} from '../../common/controller/controller';
import {inject} from 'inversify';
import {Component} from '../../types/component.types';
import {LoggerInterface} from '../../common/logger/logger.interface';
import {UserServiceInterface} from './user-service.interface';
import {ConfigInterface} from '../../common/config/config.interface';
import {Request, Response} from 'express';
import CreateUserDto from './dto/create-user.dto';
import {fillDTO} from '../../utils/common-functions';
import UserResponse from './response/user.response';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../common/errors/http-error';
import LoginUserDto from './dto/login-user.dto';
import FilmResponse from '../film/response/film.response';
import {UserRoute} from './user.models';
import {HttpMethod} from '../../types/http-method.enum';

export default class UserController extends Controller {

  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface
  ) {
    super(logger);
    this.logger.info('Register routes for UserController.');

    this.addRoute<UserRoute>({path: UserRoute.REGISTER, method: HttpMethod.Post, handler: this.create});
    this.addRoute<UserRoute>({path: UserRoute.LOGIN, method: HttpMethod.Post, handler: this.login});
    this.addRoute<UserRoute>({path: UserRoute.LOGIN, method: HttpMethod.Get, handler: this.get});
    this.addRoute<UserRoute>({path: UserRoute.LOGIN, method: HttpMethod.Delete, handler: this.logout});
    this.addRoute<UserRoute>({path: UserRoute.TO_WATCH, method: HttpMethod.Get, handler: this.getToWatch});
    this.addRoute<UserRoute>({path: UserRoute.TO_WATCH, method: HttpMethod.Post, handler: this.postToWatch});
    this.addRoute<UserRoute>({path: UserRoute.TO_WATCH, method: HttpMethod.Delete, handler: this.deleteToWatch});
  }

  async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`, 'UserController');
    }
    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserResponse, result));
  }

  async login({body}: Request<Record<string, unknown>,
    Record<string, unknown>, LoginUserDto>, _res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`, 'UserController');
    }
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async get(_: Request<Record<string, unknown>,
    Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async logout(_: Request<Record<string, unknown>,
    Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async getToWatch({body}: Request<Record<string, unknown>,
    Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = this.userService.findToWatch(body.userId);
    this.ok(_res, fillDTO(FilmResponse, result));
  }

  async postToWatch({body}: Request<Record<string, unknown>,
    Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.addToWatch(body.userId, body.movieId);
    this.noContent(_res, {message: 'Успешно. Фильм добавлен в список "К просмотру".'});
  }

  async deleteToWatch({body}: Request<Record<string, unknown>,
    Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.deleteToWatch(body.userId, body.movieId);
    this.noContent(_res, {message: 'Успешно. Фильм удален из списка "К просмотру".'});
  }
}
