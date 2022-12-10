import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity';
import CreateCommentDto from './dto/create-comment.dto';

export interface CommentServiceInterface {
  findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]>;
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
}
