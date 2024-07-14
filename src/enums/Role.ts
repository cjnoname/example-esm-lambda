import { registerEnumType } from "type-graphql";

export enum Role {
  Admin = "Admin",
  User = "User"
}

registerEnumType(Role, { name: "Role" });
