import { Role } from "src/enums/Role.js";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateAdminInput {
  @Field()
  uid: string;

  @Field(() => Role)
  role: Role;
}
