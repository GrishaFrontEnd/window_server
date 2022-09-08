import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: 'металлопрокат', description: 'Название услуги' })
  title: string;

  @ApiProperty({
    example: 'Мы оказываем услуги по металлопрокату',
    description: 'Описание услуги',
  })
  @IsString({ message: 'Должно быть строкой' })
  description: string;

  @ApiProperty({ example: 'ewfewfewfewfwefwef.jpg', description: 'Картинка' })
  @IsString({ message: 'Должно быть строкой' })
  image: string;
}
