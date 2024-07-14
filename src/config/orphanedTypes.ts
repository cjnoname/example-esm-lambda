import { Field, ObjectType } from "type-graphql";
import { KnownErrorType } from "src/enums/KnownErrorType.js";
import { SubscriptionFunctionName } from "src/enums/SubscriptionFunctionName.js";

@ObjectType()
export class GeneralOrphanedType {
  @Field(() => KnownErrorType)
  knownErrorTypes?: any;

  @Field(() => SubscriptionFunctionName)
  subscriptionFunctionName?: any;
}
