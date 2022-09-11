import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ItemsService } from 'src/items/items.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    private itemsService: ItemsService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const candidate = await this.categoryRepository.findOne({
      where: { value: createCategoryDto.value },
    });
    if (candidate) {
      throw new HttpException(
        'Данная категория уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdCategory = await this.categoryRepository.create(
      createCategoryDto,
    );
    return createdCategory;
  }

  async findAll() {
    const allCategories = await this.categoryRepository.findAll();
    return allCategories;
  }

  async findByValue(value: string) {
    const category = await this.categoryRepository.findOne({
      where: { value: value },
    });
    return category;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      include: { all: true },
    });
    if (!category) {
      throw new HttpException(
        'Данной категории не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findByValue(updateCategoryDto.oldValue);
    if (!category) {
      throw new HttpException(
        'Данной категории не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    category.value = updateCategoryDto.newValue;
    await category.save();
    return category;
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findByPk(id);
    if (!category) {
      throw new HttpException(
        'Данной категории не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    await category.$remove('property', [category.id]);
    let items = await this.itemsService.getAllByCategory(category.id);
    for (let elem of items) {
      await this.itemsService.remove(elem.id);
    }
    return await this.categoryRepository.destroy({
      where: {
        id,
      },
    });
  }
}
