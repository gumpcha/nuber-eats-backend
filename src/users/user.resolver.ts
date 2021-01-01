import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly users: UsersService) {}

  @Query(() => Boolean)
  hi() {
    return true;
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    const [ok, error] = await this.users.createAccount(createAccountInput);
    return {
      ok,
      error,
    };
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.users.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
