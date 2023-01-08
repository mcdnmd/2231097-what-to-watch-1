import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {GenreEnum} from '../../types/genre.enum.js';
import {UserEntity} from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface IFilmEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true, minlength: 2, maxlength: 100})
  public title!: string;

  @prop({trim: true, required: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true})
  public publicationDate!: Date;

  @prop({type: () => String, required: true, enum: GenreEnum})
  public genre!: GenreEnum[];

  @prop({required: true})
  public releaseYear!: number;

  @prop({required: true, default: 0})
  public rating!: number;

  @prop({required: true})
  public previewPath!: string;

  @prop({required: true})
  public moviePath!: string;

  @prop({required: true})
  public actors!: string[];

  @prop({required: true, minlength: 2, maxlength: 50})
  public producer!: string;

  @prop({required: true})
  public durationInMinutes!: number;

  @prop({default: 0})
  public commentsCount!: number;

  @prop({ref: UserEntity, required: true})
  public userId: Ref<UserEntity>;

  @prop({required: true, match: /(\S+(\.jpg)$)/})
  public posterPath!: string;

  @prop({required: true, match: /(\S+(\.jpg)$)/})
  public backgroundImagePath!: string;

  @prop({required: true})
  public backgroundColor!: string;

  @prop()
  public isPromo?: boolean;
}

export const FilmModel =  getModelForClass(FilmEntity);
