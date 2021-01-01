import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    try {
      const exist = await this.users.findOne({ email });
      if (exist) {
        return [false, 'exist email'];
      }

      this.users.save(this.users.create({ email, password, role }));
      return [true];
    } catch (error) {
      return [false, 'creating failed'];
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'not exist email',
        };
      }

      const ok = await user.checkPassword(password);
      if (!ok) {
        return {
          ok: false,
          error: 'wrong password',
        };
      }

      // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const token = jwt.sign({ id: user.id }, this.config.get('JWT_SECRET'));
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      }
    }
  }
}
