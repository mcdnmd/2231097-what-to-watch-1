import LoggerService from './common/logger/logger.service.js';
import Application from './app/application.js';
import ConfigService from './common/config/config.service.js';
import {Container} from 'inversify';
import 'reflect-metadata';
import {Component} from './types/component.types.js';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {ConfigInterface} from './common/config/config.interface.js';
import {DatabaseInterface} from './common/database-client/database.interface.js';
import DatabaseService from './common/database-client/database.service.js';
import {CommentServiceInterface} from './modules/comment/comment-service.interface.js';
import CommentService from './modules/comment/comment.service.js';
import {UserEntity, UserModel} from './modules/user/user.entity.js';
import {types} from '@typegoose/typegoose';
import UserService from './modules/user/user.service.js';
import {UserServiceInterface} from './modules/user/user-service.interface.js';
import {FilmServiceInterface} from './modules/film/film-service.interface.js';
import FilmService from './modules/film/film.service.js';
import {FilmEntity, FilmModel} from './modules/film/film.entity.js';
import {CommentEntity, CommentModel} from './modules/comment/comment.entity.js';
import {ControllerInterface} from './common/controller/controllet.interface.js';
import CommentController from './modules/comment/comment.controller.js';
import FilmController from './modules/film/film.controller.js';
import UserController from './modules/user/user.controller.js';
import {ExceptionFilterInterface} from './common/errors/exception-filter.interface';
import ExceptionFilter from './common/errors/exception-filter.js';

const appContainer = new Container();
appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();

appContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
appContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
appContainer.bind<UserController>(Component.UserController).to(UserController).inSingletonScope();

appContainer.bind<FilmServiceInterface>(Component.FilmServiceInterface).to(FilmService);
appContainer.bind<types.ModelType<FilmEntity>>(Component.FilmModel).toConstantValue(FilmModel);
appContainer.bind<ControllerInterface>(Component.FilmController).to(FilmController).inSingletonScope();

appContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
appContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
appContainer.bind<ControllerInterface>(Component.CommentController).to(CommentController).inSingletonScope();

appContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

const app = appContainer.get<Application>(Component.Application);
await app.init();
