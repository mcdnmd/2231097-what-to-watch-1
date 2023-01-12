import {Controller} from '../../common/controller/controller.js';
import {inject} from 'inversify';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {UserServiceInterface} from './user-service.interface.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {Request, Response} from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import {fillDTO} from '../../utils/common-functions.js';
import UserResponse from './response/user.response.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import LoginUserDto from './dto/login-user.dto.js';
import FilmResponse from '../film/response/film.response.js';
import {JWT_TOKEN_ALGORITHM, UserRoute} from './user.models.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';
import {UploadFileMiddleware} from '../../middlewares/upload-file.middleware.js';
import {ValidateObjectIdMiddleware} from '../../middlewares/validate-object-id.middleware.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import {createJwtToken} from '../../utils/hash-generator.js';
import AuthUserDto from './dto/auth-user.dto.js';

export default class UserController extends Controller {

  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface
  ) {
    super(logger);
    this.logger.info('Register routes for UserController.');

    this.addRoute<UserRoute>({
      path: UserRoute.REGISTER,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute<UserRoute>({path: UserRoute.LOGIN, method: HttpMethod.Get, handler: this.get});
    this.addRoute<UserRoute>({path: UserRoute.LOGIN, method: HttpMethod.Delete, handler: this.logout});
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Get,
      handler: this.getToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Post,
      handler: this.postToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Delete,
      handler: this.deleteToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.AVATAR,
      method: HttpMethod.Post,
      handler: this.updateAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('STATIC_DIRECTORY'), 'avatarPath'),
      ]
    });
  }

  async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(StatusCodes.CONFLICT,
        `User with email "${body.email}" exists.`, 'UserController');
    }
    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserResponse, result));
  }

  async login({body}: Request<Record<string, unknown>,
    Record<string, unknown>, LoginUserDto>, res: Response): Promise<void> {
    // const existedUser = await this.userService.findByEmail(body.email);
    const existedUser = await this.userService.verifyUser(body, this.configService.get('SALT'));
    if (!existedUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED,
        'email or password wrong', 'UserController');
    }
    const accessToken = await createJwtToken(
      JWT_TOKEN_ALGORITHM,
      this.configService.get('TOKEN_SECRET'),
      { email: existedUser.email, id: existedUser.id}
    );
    this.ok(res, fillDTO(AuthUserDto, {email: existedUser.email, token: accessToken}));
  }

  async get(_: Request<Record<string, unknown>,
    Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async logout(_: Request<Record<string, unknown>,
    Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async getToWatch({user}: Request<Record<string, unknown>,
    Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = await this.userService.findToWatch(user.id);
    this.ok(_res, fillDTO(FilmResponse, result));
  }

  async postToWatch({body}: Request<Record<string, unknown>,
    Record<string, unknown>, {userId: string, filmId: string}>, _res: Response): Promise<void> {
    await this.userService.addToWatch(body.filmId, body.userId);
    this.noContent(_res, {message: 'Successful. Film was added in playlist "To watch".'});
  }

  async deleteToWatch({body}: Request<Record<string, unknown>,
    Record<string, unknown>, {userId: string, filmId: string}>, _res: Response): Promise<void> {
    await this.userService.deleteToWatch(body.filmId, body.userId);
    this.noContent(_res, {message: 'Successful. Film was deleted from playlist "To watch".'});
  }

  async updateAvatar(req: Request, res: Response) {
    this.created(res, {filepath: req.file?.path});
  }
}
