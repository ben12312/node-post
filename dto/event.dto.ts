import { Expose, Type } from 'class-transformer';
import { UserDTO } from './user.dto';
import 'reflect-metadata';

export class EventDTO {
  @Expose()
  title!: string;

  @Expose()
  content!: string;

  @Expose()
  published!: Boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date

  @Expose()
  user!: UserDTO;

  @Expose()
  userId!: number;
}