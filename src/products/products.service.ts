import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async createForSeller(
    sellerId: string,
    dto: CreateProductDto,
    imageUrl?: string,
  ) {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        imageUrl,
        sellerId,
      },
    });
  }

  async updateProduct(
    productId: string,
    userId: string,
    userRole: Role,
    dto: UpdateProductDto,
    imageUrl?: string,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const isOwner = product.sellerId === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot edit this product');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...dto,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });
  }

  async deleteProduct(productId: string, userId: string, userRole: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const isOwner = product.sellerId === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot delete this product');
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { success: true };
  }

  findForSeller(sellerId: string) {
    return this.prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
