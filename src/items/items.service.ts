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
import { UpdateItemCountDto } from './dto/update-item_count.dto';
import { UpdateItemImageDto } from './dto/update-item_image.dto';
import { UpdateItemPriceDto } from './dto/update-item_price.dto';
import { UpdateItemPropertiesDto } from './dto/update-item_properties.dto';
import { UpdateItemTitleDto } from './dto/update-item_title.dto';
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
    const items = await this.itemRepository.findAll({
      include: { all: true },
      limit,
      offset,
      order: [['id', 'DESC']],
    });
    return {
      rows: items,
      count: (await this.itemRepository.findAll()).length,
    };
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
    let items = await this.itemRepository.findAll({
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
    return {
      rows: items,
      count: (await this.itemRepository.findAll()).length,
    };
  }

  async findByTitleAndCategories(
    title: string,
    category_id: number,
    limit: number,
    offset: number,
  ) {
    let items = await this.itemRepository.findAll({
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
    return {
      rows: items,
      count: (await this.itemRepository.findAll()).length,
    };
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

  async updateImage(dto: UpdateItemImageDto, image: Express.Multer.File) {
    const candidate = await this.itemRepository.findByPk(+dto.id);
    if (!candidate) {
      throw new HttpException(
        'Не существует данного предмета',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.fileService.removeFile(candidate.image);
    const updateImage = await this.fileService.createFile(image);
    const updatedItem = await this.itemRepository.update(
      { image: updateImage },
      { where: { id: +dto.id } },
    );
    return await this.itemRepository.findByPk(+dto.id);
  }

  async setCount(dto: UpdateItemCountDto) {
    const candidate = await this.itemRepository.findByPk(dto.id);
    if (!candidate) {
      throw new NotFoundException('Товара с такими id найдено не было');
    }
    await candidate.update({ count: dto.count });
    return candidate;
  }

  async updateTitle(dto: UpdateItemTitleDto) {
    const candidate = await this.itemRepository.findByPk(dto.id);
    if (!candidate) {
      throw new NotFoundException('Товара с такими id найдено не было');
    }
    await candidate.update({ title: dto.title });
    return candidate;
  }

  async updatePrice(dto: UpdateItemPriceDto) {
    const candidate = await this.itemRepository.findByPk(dto.id);
    if (!candidate) {
      throw new NotFoundException('Товара с такими id найдено не было');
    }
    await candidate.update({ price: dto.price });
    return candidate;
  }

  async updateProperties(properties: UpdateItemPropertiesDto) {
    const candidate = await this.itemRepository.findByPk(properties.id);
    if (!candidate) {
      throw new NotFoundException('Товара с такими id найдено не было');
    }
    for (let i = 0; i < properties.property.length; i++) {
      await this.itemPropertyRepostitory.update(
        {
          property: properties.property[i],
          value: properties.value[i],
        },
        { where: { item_id: properties.id } },
      );
    }
    return candidate;
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
