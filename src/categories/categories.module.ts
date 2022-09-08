import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { Property } from 'src/properties/entities/property.enity';
import { Item } from 'src/items/entities/item.entity';
import { CategoriesProperty } from './entities/categories-property.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    SequelizeModule.forFeature([Category, Property, Item, CategoriesProperty]),
    AuthModule,
    ItemsModule,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
