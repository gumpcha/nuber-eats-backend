import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtConfigOptions } from './jwt.interfaces';

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
