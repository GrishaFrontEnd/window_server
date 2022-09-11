import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Стоимость', description: 'Название поля' })
  title: string;
  @ApiProperty({ example: 'окна', description: 'название категории' })
  category_id: number;
}
