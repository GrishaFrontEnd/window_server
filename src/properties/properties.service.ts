import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoriesService } from 'src/categories/categories.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.enity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property) private propertyRepository: typeof Property,
    private categoryService: CategoriesService,
  ) {}
  async createProperty(dto: CreatePropertyDto) {
    console.log(dto);
    const property = await this.propertyRepository.findOne({
      where: { title: dto.titleProperty },
    });
    if (property) {
      throw new HttpException(
        'Данное свойство уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdProperty = await this.propertyRepository.create(dto);
    const category = await this.categoryService.findOne(dto.category_id);
    await createdProperty.$set('categories', category.id);
    createdProperty.categories = [category];
    return createdProperty;
  }

  async getAllProperties() {
    return await this.propertyRepository.findAndCountAll({
      include: { all: true },
    });
  }

  async getPropertiesByCategory(category_id: number) {
    const category = await this.categoryService.findOne(category_id);
    if (!category) {
      throw new HttpException(
        'Категория не была найдена',
        HttpStatus.NOT_FOUND,
      );
    }
    const _properties = await category.$get('property');
    return _properties;
  }

  async getOnePropertyById(id: number) {
    const property = await this.propertyRepository.findByPk(id);
    if (!property) {
      throw new HttpException(
        'Такого свойства не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    return property;
  }

  async updateProperty(updatePropertyDto: UpdatePropertyDto) {
    const _property = await this.propertyRepository.findOne({
      where: { title: updatePropertyDto.titleProperty },
    });
    if (!_property) {
      throw new HttpException(
        'Такого свойства не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    const category = await this.categoryService.findOne(
      updatePropertyDto.category_id,
    );
    await _property.update({ title: updatePropertyDto.titleProperty });
    category.$add('property', _property.id);
    _property.categories = [category];
    return _property;
  }

  async deleteProperty(id: number) {
    const _property = await this.propertyRepository.findByPk(id);
    if (!_property) {
      throw new HttpException(
        'Такого свойства не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    return await _property.destroy();
  }
}
