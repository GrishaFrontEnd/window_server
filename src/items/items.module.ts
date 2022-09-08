import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/categories/entities/category.entity';
import { Item } from './entities/item.entity';
import { FileModule } from 'src/file/file.module';
import { AuthModule } from 'src/auth/auth.module';
import { ItemProperty } from './entities/item-property.entity';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [
    SequelizeModule.forFeature([Item, Category, ItemProperty]),
    FileModule,
    AuthModule,
  ],
  exports: [ItemsService],
})
export class ItemsModule {}
