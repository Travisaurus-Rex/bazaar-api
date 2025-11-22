import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
