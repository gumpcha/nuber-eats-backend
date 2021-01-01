import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
    private readonly jwtService: JwtService,
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

      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verification.save(this.verification.create({ user }));
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
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
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

      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }

  async editProfile(userId: number, { email, password }: EditProfileInput) {
    const user = await this.users.findOne({ id: userId });
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verification.save(this.verification.create({ user }));
    }
    if (password) user.password = password;
    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.verification.findOne(
      { code },
      { relations: ['user'] },
    );
    if (!verification) return false;

    const user = verification.user;
    user.verified = true;
    await this.users.save(user);
    return true;
  }
}
