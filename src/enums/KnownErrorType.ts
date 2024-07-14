import { registerEnumType } from "type-graphql";

export enum KnownErrorType {
  API_GATEWAY_INTEGRATION_TIMEOUT = "API_GATEWAY_INTEGRATION_TIMEOUT",
  API_GATEWAY_DEFAULT_5XX = "API_GATEWAY_DEFAULT_5XX",
  USER_OPERATION_ERROR = "USER_OPERATION_ERROR"
}

registerEnumType(KnownErrorType, { name: "KnownErrorType" });
