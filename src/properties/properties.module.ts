import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Property } from './entities/property.enity';
import { Item } from 'src/items/entities/item.entity';
import { CategoriesProperty } from 'src/categories/entities/categories-property.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
  imports: [
    SequelizeModule.forFeature([Property, Item, CategoriesProperty, Category]),
    CategoriesModule,
    AuthModule,
  ],
})
export class PropertiesModule {}
