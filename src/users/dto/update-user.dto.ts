import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'example@gmail.com', description: 'почта' })
  readonly email: string;

  @ApiProperty({ example: 'randompassword123', description: 'password' })
  readonly password: string;
}
