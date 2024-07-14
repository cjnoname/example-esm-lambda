import { registerEnumType } from "type-graphql";

export enum SubscriptionFunctionName {
  Dummy = "Dummy"
}

registerEnumType(SubscriptionFunctionName, { name: "SubscriptionFunctionName" });
