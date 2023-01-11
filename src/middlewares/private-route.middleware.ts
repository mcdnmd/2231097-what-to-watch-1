import {MiddlewareInterface} from './middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import HttpError from '../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';


export class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }
    return next();
  }
}
