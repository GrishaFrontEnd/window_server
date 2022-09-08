import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ServiceCreationAttribute {
  title: string;
  description: string;
  image: string;
}

@Table({ tableName: 'services', createdAt: false, updatedAt: false })
export class Service extends Model<Service, ServiceCreationAttribute> {
  @ApiProperty({ example: 1, description: 'id услуги' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'металлопрокат', description: 'Название услуги' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @ApiProperty({
    example: 'Мы оказываем услуги по металлопрокату',
    description: 'Описание услуги',
  })
  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  description: string;

  @ApiProperty({ example: 'ewfewfewfewfwefwef.jpg', description: 'Картинка' })
  @Column({ type: DataType.STRING, allowNull: true })
  image: string;
}
