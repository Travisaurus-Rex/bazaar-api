import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { S3Service } from '../aws/s3.service';
import type { Role } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly products: ProductsService,
    private readonly s3: S3Service,
  ) {}

  @Get()
  getAll() {
    return this.products.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  @Get('seller/mine')
  getMine(@Req() req) {
    const userId = req.user.userId as string;
    return this.products.findForSeller(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() req,
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.userId as string;

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.s3.uploadProductImage(file);
    }

    return this.products.createForSeller(userId, dto, imageUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.userId as string;
    const role = req.user.role as Role;

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.s3.uploadProductImage(file);
    }

    return this.products.updateProduct(id, userId, role, dto, imageUrl);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId as string;
    const role = req.user.role as Role;

    return this.products.deleteProduct(id, userId, role);
  }
}
