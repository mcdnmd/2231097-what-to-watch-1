import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {FilmServiceInterface} from './film-service.interface.js';
import {FilmEntity} from './film.entity.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>,
  ) {}

  async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const film = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.title}`);

    return film;
  }

  async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    this.logger.info(`findById film: ${filmId}`);
    return this.filmModel.findById(filmId).exec();
  }

  async deleteById(filmId: string): Promise<void | null> {
    return this.filmModel.findByIdAndDelete(filmId);
  }

  async find(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: {filmId: '$_id'},
          pipeline: [
            {$match: {$expr: {$in: ['$$filmId', '$movies']}}},
            {$project: {_id: 1}}
          ],
          as: 'comments'
        },
      },
      {
        $addFields: {
          id: {$toString: '$_id'},
          commentsCount: {$size: '$comments'},
          rating: {$avg: '$comments.rating'}
        }
      },
      {$unset: 'comments'},
      {$limit:  60}
    ]);
  }

  async findByGenre(genre: string, limit?: number): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel.find({genre}, {}, {limit}).populate('user');
  }

  async findPromo(): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({isPromo: true}).populate('user');
  }

  async incCommentsCount(filmId: string): Promise<void | null> {
    return this.filmModel.findByIdAndUpdate(filmId, {$inc: {commentsCount: 1}});
  }

  async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndUpdate(filmId, dto).populate('user');
  }

  async updateFilmRating(filmId: string, newRating: number): Promise<void | null> {
    const oldValues = await this.filmModel.findById(filmId).select('rating commentNumber');
    const oldRating = oldValues?.['rating'] ?? 0;
    const oldCommentsCount = oldValues?.['commentsCount'] ?? 0;
    return this.filmModel.findByIdAndUpdate(filmId, {
      rating: (oldRating * oldCommentsCount + newRating) / (oldCommentsCount + 1)
    });
  }

  async exists(documentId: string): Promise<boolean> {
    return (this.filmModel.exists({_id: documentId})) !== null;
  }

}
