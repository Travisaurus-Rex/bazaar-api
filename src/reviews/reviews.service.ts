import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async userPurchasedProduct(buyerId: string, productId: string): Promise<boolean> {
    const purchase = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: { buyerId },
      },
    });

    return !!purchase;
  }

  async createReview(buyerId: string, productId: string, dto: CreateReviewDto) {
    const purchased = await this.userPurchasedProduct(buyerId, productId);
    if (!purchased) {
      throw new ForbiddenException('You can only review products you purchased.');
    }

    const existing = await this.prisma.review.findUnique({
      where: {
        buyerId_productId: { buyerId, productId },
      }
    });

    if (existing) throw new BadRequestException('You already reviewed this product');

    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        buyerId,
        productId,
      },
    });
  }

  async getProductReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        buyer: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReview(
    reviewId: string,
    userId: string,
    role: Role,
    dto: UpdateReviewDto
  ) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');

    const isOwner = review.buyerId === userId;
    const isAdmin = role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot edit this review');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
    });
  }

  async deleteReview(reviewId: string, userId: string, role: Role) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');

    const isOwner = review.buyerId === userId;
    const isAdmin = role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot delete this review');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    return { success: true };
  }

  // For product display: rating average + count
  async getRatingSummary(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating,
    };
  }
}
