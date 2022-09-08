import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Пластиковые', description: 'Значение поля' })
  value: string;
}
