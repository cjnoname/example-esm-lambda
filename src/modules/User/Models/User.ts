import { Entity, Column, PrimaryColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { IsEmail } from "class-validator";
import { Role } from "src/enums/Role.js";

export type IUser = Omit<AdminUser, "fullName" | "userMemberAccesses" | "isIdmSetup" | "isDeleted">;

@Entity("user", { schema: "public" })
@ObjectType("User")
export class AdminUser {
  @PrimaryColumn()
  @Field()
  uid: string;

  @Column()
  @Field()
  @IsEmail()
  email: string;

  @Column({ name: "first_name" })
  @Field({ nullable: true })
  firstName?: string;

  @Column({ name: "last_name" })
  @Field({ nullable: true })
  lastName?: string;

  @Column()
  @Field(() => Role)
  role: Role;
}
