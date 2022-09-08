import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/roles.entities';
import { UserRoles } from './roles/entities/user-roles.entities';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { PropertiesModule } from './properties/properties.module';
import { ServicesModule } from './services/services.module';
import * as path from 'path';
import { Category } from './categories/entities/category.entity';
import { Item } from './items/entities/item.entity';
import { Property } from './properties/entities/property.enity';
import { CategoriesProperty } from './categories/entities/categories-property.entity';
import { ItemProperty } from './items/entities/item-property.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        UserRoles,
        Category,
        Item,
        Property,
        CategoriesProperty,
        ItemProperty,
      ],
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    FileModule,
    ItemsModule,
    CategoriesModule,
    PropertiesModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
