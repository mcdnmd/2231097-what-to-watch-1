import {Expose} from 'class-transformer';

export default class AuthUserDto {
  @Expose()
  public email!: string;

  @Expose()
  public token!: string;
}
