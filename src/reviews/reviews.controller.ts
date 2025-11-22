import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  // Buyer adds a review to a product
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer', 'admin')
  @Post(':productId')
  create(@Req() req, @Param('productId') productId: string, @Body() dto: CreateReviewDto) {
    const buyerId = req.user.userId;
    return this.reviews.createReview(buyerId, productId, dto);
  }

  // Public: view product reviews
  @Get('product/:productId')
  getForProduct(@Param('productId') productId: string) {
    return this.reviews.getProductReviews(productId);
  }

  // Update own review
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer', 'admin')
  @Put('item/:id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateReviewDto
  ) {
    return this.reviews.updateReview(id, req.user.userId, req.user.role as Role, dto);
  }

  // Delete own review
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('buyer', 'admin')
  @Delete('item/:id')
  delete(@Param('id') id: string, @Req() req) {
    return this.reviews.deleteReview(id, req.user.userId, req.user.role as Role);
  }

  // Public: rating summary (avg + count)
  @Get('summary/:productId')
  summary(@Param('productId') productId: string) {
    return this.reviews.getRatingSummary(productId);
  }
}
