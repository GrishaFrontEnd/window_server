import { ApiProperty } from '@nestjs/swagger/dist';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { CategoriesProperty } from 'src/categories/entities/categories-property.entity';
import { Category } from 'src/categories/entities/category.entity';

interface PropertyCreationAttribute {
  title: string;
}

@Table({ tableName: 'properties', updatedAt: false, createdAt: false })
export class Property extends Model<Property, PropertyCreationAttribute> {
  @ApiProperty({ example: 1, description: 'id сущности' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Стоимость', description: 'Название поля' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @BelongsToMany(() => Category, () => CategoriesProperty)
  categories: Category[];
}
