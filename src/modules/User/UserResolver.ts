import { Resolver, Query, Ctx } from "type-graphql";
import { Service } from "typedi";
import { AdminUser } from "./Models/User.js";
import type { IContext } from "src/config/context.js";

@Service()
@Resolver()
export class UserResolver {
  @Query(() => AdminUser)
  async getAdminUser(@Ctx() { user }: IContext): Promise<AdminUser> {
    return user!;
  }
}
