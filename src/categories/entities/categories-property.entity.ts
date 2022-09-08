import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Property } from 'src/properties/entities/property.enity';
import { Category } from './category.entity';

interface CategoriesPropertyCreationAttribute {
  category_id: number;
  property_id: number;
}

@Table({
  tableName: 'categories_properties',
  createdAt: false,
  updatedAt: false,
})
export class CategoriesProperty extends Model<
  CategoriesProperty,
  CategoriesPropertyCreationAttribute
> {
  @ApiProperty({ example: 1, description: 'id связи' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Category)
  @ApiProperty({ example: 1, description: 'id категории' })
  @Column({ type: DataType.INTEGER })
  category_id: number;

  @ForeignKey(() => Property)
  @ApiProperty({ example: 1, description: 'id свойства' })
  @Column({ type: DataType.INTEGER })
  property_id: number;
}
