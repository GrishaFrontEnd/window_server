import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FileService } from 'src/file/file.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemProperty } from './entities/item-property.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item) private itemRepository: typeof Item,
    @InjectModel(ItemProperty)
    private itemPropertyRepostitory: typeof ItemProperty,
    private fileService: FileService,
  ) {}
  async create(createItemDto: CreateItemDto, image: any) {
    const candidate = await this.itemRepository.findOne({
      where: { title: createItemDto.title },
    });
    if (candidate) {
      throw new HttpException(
        'Данный предмет уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileName = await this.fileService.createFile(image);
    const createdItem = await this.itemRepository.create({
      ...createItemDto,
      image: fileName,
    });
    const _itemProperties: ItemProperty[] = [];
    for (let i = 0; i < createItemDto.property.length; i++) {
      let _itemProperty = await this.itemPropertyRepostitory.create({
        property: createItemDto.property[i],
        value: createItemDto.value[i],
        item_id: createdItem.id,
      });
      _itemProperties.push(_itemProperty);
    }
    return {
      createdItem,
      properties: _itemProperties,
    };
  }

  async getAllByCategory(category: number) {
    return await this.itemRepository.findAll({
      where: { category_id: category },
    });
  }

  async setCategoryIfDelete(category: number) {
    const items = await this.itemRepository.findAll({
      where: { category_id: category },
    });
    if (!items || items.length === 0) {
      throw new HttpException(
        'Товаров в данной категории не найдено',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.itemRepository.update(
      { category_id: 1 },
      { where: { category_id: category } },
    );
    return true;
  }

  async findAll(limit: number, offset: number) {
    const items = await this.itemRepository.findAndCountAll({
      include: { all: true },
      limit,
      offset,
      order: [['id', 'DESC']],
    });
    return items;
  }

  async findByCategories(category_id: number, limit: number, offset: number) {
    const items = await this.itemRepository.findAll({
      where: {
        category_id,
      },
      include: { all: true },
      limit,
      offset,
    });
    return {
      rows: items,
      count: (await this.getAllByCategory(category_id)).length,
    };
  }

  async findByTitle(title: string, limit: number, offset: number) {
    let items = await this.itemRepository.findAndCountAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${title}%`,
            },
          },
          {
            title: {
              [Op.substring]: `${title}`,
            },
          },
          {
            title: {
              [Op.iLike]: `%${title}%`,
            },
          },
        ],
      },
      limit,
      offset,
    });
    return items;
  }

  async findByTitleAndCategories(
    title: string,
    category_id: number,
    limit: number,
    offset: number,
  ) {
    let items = await this.itemRepository.findAndCountAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${title}%`,
            },
          },
          {
            title: {
              [Op.substring]: `${title}`,
            },
          },
          {
            title: {
              [Op.iLike]: `%${title}%`,
            },
          },
        ],
        category_id,
      },
      limit,
      offset,
    });
    return items;
  }

  async findOne(id: number) {
    const item = await this.itemRepository.findByPk(id);
    if (!item) {
      throw new NotFoundException('Такого предмета не существует');
    }
    const properties = await this.itemPropertyRepostitory.findAll({
      where: { item_id: id },
    });
    return {
      item,
      _properties: properties,
    };
  }

  async update(updateItemDto: UpdateItemDto, image: any) {
    const candidate = await this.itemRepository.findByPk(updateItemDto.id);
    if (!candidate) {
      throw new HttpException(
        'Не существует данного предмета',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.fileService.removeFile(candidate.image);
    const updateImage = await this.fileService.createFile(image);
    const updatedItem = await this.itemRepository.update(
      { ...updateItemDto, image: updateImage },
      { where: { id: updateItemDto.id } },
    );
    for (let i = 0; i < updateItemDto.property.length; i++) {
      await this.itemPropertyRepostitory.update(
        {
          property: updateItemDto[i].property,
          value: updateItemDto[i].value,
        },
        { where: { item_id: updateItemDto.id } },
      );
    }
    return updatedItem;
  }

  async remove(id: number) {
    const candidate = await this.itemRepository.findByPk(id);
    if (!candidate) {
      throw new HttpException(
        'Не существует данного предмета',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.fileService.removeFile(candidate.image);
    await this.itemPropertyRepostitory.destroy({ where: { item_id: id } });
    return await this.itemRepository.destroy({ where: { id } });
  }
}
