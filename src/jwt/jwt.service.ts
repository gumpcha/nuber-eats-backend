import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { JwtConfigOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtConfigOptions,
  ) {}

  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.secret_key);
  }

  verify(token: string) {
    return jwt.verify(token, this.options.secret_key);
  }
}
