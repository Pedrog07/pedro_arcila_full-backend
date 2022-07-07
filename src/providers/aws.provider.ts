import { Injectable } from '@nestjs/common';
import { S3, config } from 'aws-sdk';
import { generateUniqueKey } from 'utils';

@Injectable()
export class AwsProvider {
  s3: S3;
  bucket: string;
  folder: string;
  constructor() {
    const { AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET, S3_FOLDER } =
      process.env;

    config.update({
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: 'eu-west-1',
    });
    this.s3 = new S3();
    this.bucket = S3_BUCKET;
    this.folder = S3_FOLDER;
  }

  getFileKey(id: string, originalName: string) {
    const fileName = `${generateUniqueKey()}_${originalName}`;
    return [`${this.folder}/${id}/${fileName}`, fileName];
  }

  getCurrentFileKey(id: string, previousName: string, includeBucket?: boolean) {
    const dotExtIndex = previousName.lastIndexOf('.');
    return [
      `${includeBucket ? `${this.bucket}/` : ''}${
        this.folder
      }/${id}/${previousName}`,
      dotExtIndex >= 0 ? previousName.slice(dotExtIndex) : '',
    ];
  }

  buildNewS3Url(fileUrl: string, key: string) {
    return `${fileUrl.split(this.folder)[0]}${key}`;
  }
}
