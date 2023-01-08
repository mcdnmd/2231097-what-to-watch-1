import {ControllerInterface} from './controllet.interface.js';
import {Response, Router} from 'express';
import {LoggerInterface} from '../logger/logger.interface.js';
import {RouteInterface} from './route.interface.js';
import asyncHandler from 'express-async-handler';
import {StatusCodes} from 'http-status-codes';
import {injectable} from 'inversify';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(protected readonly logger: LoggerInterface) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  addRoute<T extends string>(route: RouteInterface<T>) {
    const routerHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(route.handler.bind(middleware))
    );
    const allHandlers = middlewares ? [...middlewares, routerHandler] : routerHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  send<T>(res: Response, statusCode: number, data: T) {
    res.type('application/json').status(statusCode).json(data);
  }

  created<T>(res: Response, data: T) {
    this.send(res, StatusCodes.CREATED, data);
  }

  noContent<T>(res: Response, data: T) {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  ok<T>(res: Response, data: T) {
    this.send(res, StatusCodes.OK, data);
  }
}

