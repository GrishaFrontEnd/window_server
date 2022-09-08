import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret:
        process.env.PRIVATE_KEY || 'SECRET_KEY_SDFDGHFHHDFGFDGRTGHRH_123321',
      signOptions: {
        expiresIn: '10000h',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
