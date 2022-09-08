import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'почта' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'неккоректный email' })
  readonly email: string;

  @ApiProperty({ example: 'randompassword123', description: 'password' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'не меньше 4 и 16 символов' })
  readonly password: string;
}
