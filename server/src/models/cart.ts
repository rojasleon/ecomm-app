import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  Min,
  Max
} from 'sequelize-typescript';
import { User } from './user';
import { Product } from './product';

@Table({ underscored: true, tableName: 'cart' })
export class Cart extends Model<Cart> {
  @Min(0)
  @Max(5)
  @Column
  quantity!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Product)
  product!: Product;
}
