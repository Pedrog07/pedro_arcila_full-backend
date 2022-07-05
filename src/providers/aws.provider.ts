import { Injectable } from '@nestjs/common';
import { S3, config } from 'aws-sdk';

@Injectable()
export class AwsProvider {
  s3: S3;
  bucket: string;
  constructor() {
    const { AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET } = process.env;

    config.update({
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    });
    this.s3 = new S3();
    this.bucket = S3_BUCKET;
  }
}
