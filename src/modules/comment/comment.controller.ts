import {Controller} from '../../common/controller/controller.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {FilmServiceInterface} from '../film/film-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {Request, Response} from 'express';
import HttpError from '../../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../utils/common-functions.js';
import CommentResponse from './response/comment.response.js';
import {CommentRoute} from './comment.models.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController.');

    this.addRoute<CommentRoute>({
      path: CommentRoute.ROOT,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
      ]
    });
  }

  async create(req: Request<object, object, CreateCommentDto>, res: Response): Promise<void> {
    const {body, user} = req;
    if(!await this.filmService.exists(body.filmId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${body.filmId} not found.`,
        'CommentController'
      );
    }
    const comment = await this.commentService.create({...body, userId: user.id});
    await this.filmService.incCommentsCount(body.filmId);
    this.created(res, fillDTO(CommentResponse,  comment));
  }
}
