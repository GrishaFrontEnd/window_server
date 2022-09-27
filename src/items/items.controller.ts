import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuards } from 'src/auth/roles.guards';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UpdateItemPropertiesDto } from './dto/update-item_properties.dto';
import { UpdateItemCountDto } from './dto/update-item_count.dto';
import { UpdateItemPriceDto } from './dto/update-item_price.dto';
import { UpdateItemTitleDto } from './dto/update-item_title.dto';
import { UpdateItemImageDto } from './dto/update-item_image.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.itemsService.create(createItemDto, image);
  }

  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 16,
    @Query('category_id') category_id: number = 1,
    @Query('title') title: string = '',
  ) {
    limit = limit > 50 ? 50 : limit;
    let offset = limit * page - limit;
    title = title.toLowerCase();
    if (category_id == 1 && title == '') {
      return this.itemsService.findAll(limit, offset);
    } else if (title == '' && category_id > 1) {
      return this.itemsService.findByCategories(category_id, limit, offset);
    } else if (title && category_id == 1) {
      return this.itemsService.findByTitle(title, limit, offset);
    } else if (title && category_id > 1) {
      return this.itemsService.findByTitleAndCategories(
        title,
        category_id,
        limit,
        offset,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch('/image')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: UpdateItemImageDto,
  ) {
    return this.itemsService.updateImage(dto, image);
  }

  @Patch('/title')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  updateTitle(@Body() dto: UpdateItemTitleDto) {
    return this.itemsService.updateTitle(dto);
  }

  @Patch('/price')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  updatePrice(@Body() dto: UpdateItemPriceDto) {
    return this.itemsService.updatePrice(dto);
  }

  @Patch('/count')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  setCountItem(@Body() dto: UpdateItemCountDto) {
    console.log(dto);
    return this.itemsService.setCount(dto);
  }

  @Patch('/properties')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  updateProperties(@Body() updateItemProperties: UpdateItemPropertiesDto) {
    return this.itemsService.updateProperties(updateItemProperties);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
