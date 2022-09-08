import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Item } from 'src/items/entities/item.entity';
import { Property } from 'src/properties/entities/property.enity';
import { CategoriesProperty } from './categories-property.entity';

interface CategoryCreationAttribute {
  value: string;
}

@Table({ tableName: 'categories', createdAt: false, updatedAt: false })
export class Category extends Model<Category, CategoryCreationAttribute> {
  @ApiProperty({ example: 1, description: 'id сущности' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Пластиковые', description: 'Значение поля' })
  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @HasMany(() => Item)
  items: Item[];

  @BelongsToMany(() => Property, () => CategoriesProperty)
  property: Property[];
}
