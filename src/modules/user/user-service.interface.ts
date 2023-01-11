import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {FilmEntity} from '../film/film.entity.js';
import LoginUserDto from './dto/login-user.dto';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findToWatch(filmId: string): Promise<DocumentType<FilmEntity>[]>;
  addToWatch(filmId: string, userId: string): Promise<void | null>;
  deleteToWatch(filmId: string, userId: string): Promise<void | null>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
}
