import {inject, injectable} from 'inversify';
import {types} from '@typegoose/typegoose';
import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {Component} from '../../types/component.types.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {FilmServiceInterface} from '../film/film-service.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(@inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
              @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.filmService.updateFilmRating(dto.filmId, dto.rating);
    await this.filmService.incCommentsCount(dto.filmId);
    return comment.populate('userId');
  }

  public async findByFilmId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({movieId}).populate('userId');
  }
}
