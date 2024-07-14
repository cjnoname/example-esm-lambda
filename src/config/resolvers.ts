import { UserResolver } from "src/modules/User/UserResolver.js";
import type { NonEmptyArray } from "type-graphql";

export const resolvers: NonEmptyArray<Function> = [UserResolver];
