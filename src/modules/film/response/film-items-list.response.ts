import {Expose} from 'class-transformer';
import {GenreEnum} from '../../../types/genre.enum.js';


export default class MovieListItemResponse {
  @Expose()
  public title!: string;

  @Expose()
  public publishingDate!: number;

  @Expose()
  public genre!: GenreEnum;

  @Expose()
  public previewPath!: string;

  @Expose()
  public userId!: string;

  @Expose()
  public posterPath!: string;

  @Expose()
  public commentsCount!: number;
}
