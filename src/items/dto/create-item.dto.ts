import { ApiProperty } from '@nestjs/swagger';
import { PropValue } from '../entities/item.entity';

export class CreateItemDto {
  @ApiProperty({ example: 'окно', description: 'Название предмета' })
  title: string;
  @ApiProperty({ example: 500, description: 'Стоимость предмета' })
  price: number;
  @ApiProperty({ example: 1, description: 'Принадлежность к категории' })
  category_id: number;
  @ApiProperty({ example: 'окнdfreо.jpg', description: 'Изображение предмета' })
  image: string;
  @ApiProperty({ example: [{ бу: 'нет' }], description: 'Массив свойств' })
  property: string[];
  @ApiProperty({ example: [{ бу: 'нет' }], description: 'Массив свойств' })
  value: string[];
}
