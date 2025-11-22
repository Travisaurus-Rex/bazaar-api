import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket = process.env.S3_BUCKET_NAME!;
  private baseUrl = process.env.S3_BASE_URL; // optional

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      // credentials will be read from env if not explicitly passed
    });
  }

  async uploadProductImage(file: Express.Multer.File): Promise<string> {
    const key = `products/${randomUUID()}-${file.originalname}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    if (this.baseUrl) {
      return `${this.baseUrl}/${key}`;
    }

    // fallback generic S3 URL
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
