import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Стоимость', description: 'Название поля' })
  titleProperty: string;
  @ApiProperty({ example: 'окна', description: 'название категории' })
  category_id: number;
}
