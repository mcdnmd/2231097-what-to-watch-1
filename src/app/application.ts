import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.types.js';
import {getURI} from '../utils/db.js';
import {DatabaseInterface} from '../common/database-client/database.interface.js';
import express, {Express} from 'express';
import {ControllerInterface} from '../common/controller/controllet.interface.js';
import {ExceptionFilterInterface} from '../common/errors/exception-filter.interface.js';
import {AuthenticateMiddleware} from '../middlewares/authenticate.middleware.js';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    @inject(Component.FilmController) private filmController: ControllerInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
  ) {
    this.expressApp = express();
  }

  private initRoutes() {
    this.expressApp.use('/movies', this.filmController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  private initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get('STATIC_DIRECTORY')));
    const authMiddleware = new AuthenticateMiddleware(this.config.get('TOKEN_SECRET'));
    this.expressApp.use(authMiddleware.execute.bind(authMiddleware));
  }

  private initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Port ${this.config.get('PORT')}`);
    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();

    const port = this.config.get('PORT');
    this.expressApp.listen(port, () => this.logger.info(`Server started on http://localhost:${port}`));
  }
}
