import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(buyerId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { buyerId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { buyerId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    }

    return cart;
  }

  async addItem(buyerId: string, dto: AddItemDto) {
    const cart = await this.getOrCreateCart(buyerId);

    const existing = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + dto.quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
  }

  async updateItem(buyerId: string, itemId: string, dto: UpdateItemDto) {
    const cart = await this.getOrCreateCart(buyerId);

    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.cartId !== cart.id) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(buyerId: string, itemId: string) {
    const cart = await this.getOrCreateCart(buyerId);

    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.cartId !== cart.id) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { success: true };
  }

  async clearCart(buyerId: string) {
    const cart = await this.getOrCreateCart(buyerId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true };
  }
}
