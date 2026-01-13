import {
  IsString,
  IsNumber,
  Min,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(0.01, { message: 'Price must be at least $0.04' })
  price: number;

  @IsOptional()
  @IsString()
  imgUrl?: string;
}
