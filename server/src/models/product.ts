import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  Default
} from 'sequelize-typescript';
import { User } from './user';

@Table({ underscored: true })
export class Product extends Model<Product> {
  @Column
  name!: string;

  @Column
  price!: number;

  @Column
  description!: string;

  @Default(false)
  @Column
  wishlisted!: boolean;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
