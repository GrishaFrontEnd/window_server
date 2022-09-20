import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Get('/me')
  async me(@Headers() authorization) {
    const token = authorization.authorization;
    if (token) {
      return this.authService.me(token.split(' ')[1]);
    } else if (!token || token === undefined || token === null) {
      return this.authService.unlogUser();
    }
  }

  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}
