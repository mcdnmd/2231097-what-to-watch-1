import {MiddlewareInterface} from './middleware.interface.js';
import * as jose from 'jose';
import {NextFunction, Request, Response} from 'express';
import HttpError from '../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {createSecretKey} from 'crypto';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly secret: string) {
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers?.authorization?.split(' ');
    if (!authHeader){
      return next();
    }
    const [, token] = authHeader;
    try {
      const {payload} = await jose.jwtVerify(token, createSecretKey(this.secret, 'utf-8'));
      req.user = {id: `${payload.id}`, email: `${payload.email}`};
      return next();
    } catch {
      return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', 'AuthenticateMiddleware'));
    }
  }
}
