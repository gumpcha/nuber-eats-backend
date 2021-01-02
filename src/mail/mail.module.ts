import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailConfigOptions } from './mail.interfaces';

@Module({})
export class MailModule {
  static forRoot(options: MailConfigOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        // MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      // exports: [],
    };
  }
}
