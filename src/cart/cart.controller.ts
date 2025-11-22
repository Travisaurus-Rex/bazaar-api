import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('buyer', 'admin') // Only buyers use cart
export class CartController {
  constructor(private cart: CartService) {}

  @Get()
  getMyCart(@Req() req) {
    return this.cart.getOrCreateCart(req.user.userId);
  }

  @Post('add')
  addItem(@Req() req, @Body() dto: AddItemDto) {
    return this.cart.addItem(req.user.userId, dto);
  }

  @Patch('item/:id')
  updateItem(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.cart.updateItem(req.user.userId, id, dto);
  }

  @Delete('item/:id')
  removeItem(@Req() req, @Param('id') id: string) {
    return this.cart.removeItem(req.user.userId, id);
  }

  @Delete('clear')
  clear(@Req() req) {
    return this.cart.clearCart(req.user.userId);
  }
}
