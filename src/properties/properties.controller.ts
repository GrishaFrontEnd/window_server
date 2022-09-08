import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuards } from 'src/auth/roles.guards';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  createProperty(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.createProperty(createPropertyDto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  @Get()
  getAllProperties() {
    return this.propertiesService.getAllProperties();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  @Get('/:value')
  getPropertiesByCategory(@Query('category_id') category_id: number = 1) {
    return this.propertiesService.getPropertiesByCategory(category_id);
  }

  @Get('/:id')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  getOnePropertyById(@Param('id') id: number) {
    return this.propertiesService.getOnePropertyById(+id);
  }

  @Patch()
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  updateProperty(@Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.updateProperty(updatePropertyDto);
  }

  @Delete('/:id')
  @Roles('ADMIN')
  @UseGuards(RolesGuards)
  deleteProperty(@Param('id') id: number) {
    return this.propertiesService.deleteProperty(+id);
  }
}
