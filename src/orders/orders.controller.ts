import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { Role } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // Buyer places order
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer', 'admin')
  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    const buyerId = req.user.userId;
    return this.orders.createOrder(buyerId, dto);
  }

  // Buyer sees their own orders
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer', 'admin')
  @Get('mine')
  getMine(@Req() req) {
    const buyerId = req.user.userId;
    return this.orders.findForBuyer(buyerId);
  }

  // Admin sees all orders
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  getAll() {
    return this.orders.findAll();
  }

  // Get single order (buyer-only for own order, admin for all)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer', 'admin')
  @Get(':id')
  getOne(@Param('id') id: string, @Req() req) {
    return this.orders.findOne(id, req.user.userId, req.user.role as Role);
  }
}
