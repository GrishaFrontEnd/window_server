import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { User } from 'src/users/entities/user.entity';
import { Role } from './entities/roles.entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRoles } from './entities/user-roles.entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [SequelizeModule.forFeature([User, Role, UserRoles]), AuthModule],
  exports: [RolesService],
})
export class RolesModule {}
