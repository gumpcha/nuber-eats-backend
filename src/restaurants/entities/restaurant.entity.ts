import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  isVegan: boolean;

  @Field(() => Boolean)
  address: string;

  @Field(() => Boolean)
  ownerName: string;
}
