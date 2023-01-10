import {GenreEnum} from '../../../types/genre.enum.js';
import {
  IsArray,
  IsDateString, IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min
} from 'class-validator';

export default class UpdateFilmDto {
  @IsOptional()
  @Length(2, 100, {message: 'title length must be from 2 to 100 symbols'})
  public title!: string;

  @IsOptional()
  @Length(20, 1024, {message: 'description length must be from 20 to 1024 symbols'})
  public description!: string;

  @IsOptional()
  @IsDateString({}, {message: 'publicationDate must be valid ISO date'})
  public publicationDate!: Date;

  @IsOptional()
  @IsEnum(GenreEnum, {message: 'genre must be one of: \'comedy\',' +
      ' \'crime\', \'documentary\', \'drama\', \'horror\', \'family\', \'romance\', \'scifi\', \'thriller\''})
  public genre!: GenreEnum;

  @IsOptional()
  @IsInt({message: 'releaseYear must be an integer'})
  @Min(1895, {message: 'Minimum releaseYear is 1895'})
  @Max(2023, {message: 'Maximum releaseYear is 2022'})
  public releaseYear!: number;

  @IsOptional()
  @IsString({message: 'previewPath is required'})
  public previewPath!: string;

  @IsOptional()
  @IsString({message: 'moviePath is required'})
  public moviePath!: string;

  @IsOptional()
  @IsArray({message: 'actors must be an array'})
  public actors!: string[];

  @IsOptional()
  @IsString({message: 'producer is required'})
  public producer!: string;

  @IsOptional()
  @IsInt({message: 'durationInMinutes must be an integer'})
  @Min(0, {message: 'durationInMinutes can not be less than 0'})
  public durationInMinutes!: number;

  @IsOptional()
  @IsMongoId({message: 'userId field must be valid an id'})
  public userId!: string;

  @IsOptional()
  @Matches(/(\S+(\.jpg)$)/, {message: 'posterPath must be .jpg format image'})
  @IsString({message: 'posterPath is required'})
  public posterPath!: string;

  @IsOptional()
  @Matches(/(\S+(\.jpg)$)/, {message: 'backgroundImagePath must be .jpg format image'})
  @IsString({message: 'backgroundImagePath is required'})
  public backgroundImagePath!: string;

  @IsOptional()
  @IsString({message: 'backgroundColor is required'})
  public backgroundColor!: string;
}
