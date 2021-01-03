import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { MailConfigOptions, MailTemplateVars } from './mail.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailConfigOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: string,
    templateVars: MailTemplateVars[],
  ) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain_name}>`);
    form.append('to', `gump.cha@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    templateVars.forEach(({ key, value }) => {
      form.append(`v:${key}`, value);
    });
    try {
      await got(
        `https://api.mailgun.net/v3/${this.options.domain_name}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.api_key}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify your email', 'verify-email', [
      { key: 'username', value: email },
      { key: 'code', value: code },
    ]);
  }
}
