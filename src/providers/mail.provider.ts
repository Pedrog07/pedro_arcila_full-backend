import { Injectable } from '@nestjs/common';

@Injectable()
export class MailProvider {
  auth: { username: string; password: string };
  mailHost: string;
  constructor() {
    const { SENDWITHUS_API_KEY, SENDWITHUS_HOST } = process.env;

    this.auth = {
      username: SENDWITHUS_API_KEY,
      password: '',
    };
    this.mailHost = SENDWITHUS_HOST;
  }
}
