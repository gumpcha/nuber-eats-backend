import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtConfigOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtConfigOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [JwtService],
    };
  }
}