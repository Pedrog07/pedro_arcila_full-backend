import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Templates } from './types';

@Injectable()
export class MailProvider {
  private auth: { username: string; password: string };
  private mailHost: string;
  private templates: Templates;
  constructor() {
    const {
      SENDWITHUS_API_KEY,
      SENDWITHUS_HOST,
      REGISTRATION_TEMPLATE,
      RESET_PASSWORD_TEMPLATE,
    } = process.env;

    this.auth = {
      username: SENDWITHUS_API_KEY,
      password: '',
    };
    this.mailHost = SENDWITHUS_HOST;
    this.templates = {
      registration: REGISTRATION_TEMPLATE,
      resetPassword: RESET_PASSWORD_TEMPLATE,
    };
  }

  async sendRegistrationEmail(email: string, data: any) {
    try {
      await axios.post(
        `${this.mailHost}/send`,
        {
          template: this.templates.registration,
          recipient: {
            address: email,
          },
          template_data: data,
        },
        { auth: this.auth },
      );
    } catch (error) {
      Logger.log(error.message);
    }
  }
}
