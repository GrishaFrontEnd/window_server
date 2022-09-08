import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private serviceRepository: typeof Service,
    private fileService: FileService,
  ) {}
  async create(createServiceDto: CreateServiceDto, image) {
    const candidate = await this.serviceRepository.findOne({
      where: { title: createServiceDto.title },
    });
    if (candidate) {
      throw new HttpException(
        'Данная услуга уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileName = await this.fileService.createFile(image);
    const createdService = await this.serviceRepository.create({
      ...createServiceDto,
      image: fileName,
    });
    return createdService;
  }

  async findAll() {
    const services = await this.serviceRepository.findAll();
    return services;
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findByPk(id);
    if (!service) {
      throw new HttpException(
        'Данной услуги не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    return service;
  }

  async update(updateServiceDto: UpdateServiceDto, image: Express.Multer.File) {
    const service = await this.serviceRepository.findByPk(updateServiceDto.id);
    if (!service) {
      throw new HttpException(
        'Данной услуги не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.fileService.removeFile(service.image);
    const fileName = await this.fileService.createFile(image);
    const updatedService = await this.serviceRepository.update(
      { ...updateServiceDto, image: fileName },
      { where: { id: updateServiceDto.id } },
    );
    return updatedService;
  }

  async remove(id: number) {
    const service = await this.serviceRepository.findByPk(id);
    if (!service) {
      throw new HttpException(
        'Данной услуги не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.fileService.removeFile(service.image);
    return await this.serviceRepository.destroy({ where: { id } });
  }
}
