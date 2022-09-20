import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'пользователь не найден' });
  }

  generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
      isAdmin: payload.roles.some((role) => role.value.includes('ADMIN')),
      email: user.email,
    };
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  unlogUser() {
    return {
      token: '',
      email: '',
      isAdmin: false,
    };
  }

  async me(token: string) {
    const isVerifyToken = await this.jwtService.verify(token);
    if (!isVerifyToken) {
      throw new HttpException('Токен не верифицирован', HttpStatus.FORBIDDEN);
    }
    const decoded: any = this.jwtService.decode(token);
    return {
      token,
      email: decoded.email,
      isAdmin: decoded.roles.some((role) => role.value.includes('ADMIN')),
    };
  }

  async registration(userDto: CreateUserDto) {
    let candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });
    if (user) {
      return this.generateToken(user);
    }
  }
}
