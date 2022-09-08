import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/categories/entities/category.entity';
import { ItemProperty } from './item-property.entity';

export interface PropValue {
  property: string;
  value: string;
}

interface ItemCreationAttribute {
  title: string;
  price: number;
  category_id: number;
  image: string;
  count: number;
}

@Table({ tableName: 'items', updatedAt: false, createdAt: false })
export class Item extends Model<Item, ItemCreationAttribute> {
  @ApiProperty({ example: 1, description: 'id сущности' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'окно', description: 'Название предмета' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 500, description: 'Стоимость предмета' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  price: number;

  @ForeignKey(() => Category)
  @ApiProperty({ example: 1, description: 'Принадлежность к категории' })
  @Column({ type: DataType.INTEGER })
  category_id: number;

  @ApiProperty({ example: 'окно.jpg', description: 'Изображение предмета' })
  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @ApiProperty({ example: 5, description: 'Количество единиц товара' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  count: number;

  @HasMany(() => ItemProperty)
  properties: ItemProperty[];
}
