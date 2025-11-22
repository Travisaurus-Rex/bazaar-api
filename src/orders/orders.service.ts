import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(buyerId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Fetch all products included in the order
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    // Compute total
    let total = 0;

    const orderItemData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const linePrice = product.price * item.quantity;
      total += linePrice;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Create order + order items transactionally
    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          buyerId,
          total,
        },
      });

      await tx.orderItem.createMany({
        data: orderItemData.map((i) => ({
          ...i,
          orderId: createdOrder.id,
        })),
      });

      return createdOrder;
    });

    return order;
  }

  // Buyer: return only their own orders
  async findForBuyer(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin: view all orders
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Find single order with permission checks
  async findOne(orderId: string, userId: string, role: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const isOwner = order.buyerId === userId;
    const isAdmin = role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot view this order');
    }

    return order;
  }
}
