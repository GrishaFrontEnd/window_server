import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Item } from './item.entity';

export interface ItemPropertyCreationAttribute {
  property: string;
  value: string;
  item_id: number;
}

@Table({ tableName: 'item_properties', createdAt: false, updatedAt: false })
export class ItemProperty extends Model<
  ItemProperty,
  ItemPropertyCreationAttribute
> {
  @ApiProperty({ example: 1, description: 'id связи' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Ширина', description: 'Название атрибута' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  property: string;

  @ApiProperty({ example: '1200', description: 'Значение атрибута' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  value: string;

  @ForeignKey(() => Item)
  @ApiProperty({ example: 1, description: 'id товара' })
  @Column({ type: DataType.INTEGER })
  item_id: number;
}
