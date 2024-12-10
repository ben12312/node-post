import { Expose } from 'class-transformer';

export class UserDTO {
  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  password!: string;
}