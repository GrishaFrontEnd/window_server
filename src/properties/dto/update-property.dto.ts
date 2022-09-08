import { ApiProperty } from '@nestjs/swagger';
import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends CreatePropertyDto {
  @ApiProperty({ example: 1, description: 'id свойства' })
  id: number;
}
