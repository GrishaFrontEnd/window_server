import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends CreateItemDto {
  @ApiProperty({ example: 1, description: 'id предмета' })
  @IsNumber()
  id: number;
}
