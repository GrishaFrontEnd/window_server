import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuards } from 'src/auth/roles.guards';
import { Roles } from 'src/auth/roles-auth.decorator';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.servicesService.create(createServiceDto, image);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch()
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.servicesService.update(updateServiceDto, image);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
