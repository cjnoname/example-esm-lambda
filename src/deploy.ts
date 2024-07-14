import { App, Stack } from "aws-cdk-lib";
import { Bucket, BucketAccessControl, BucketEncryption, HttpMethods } from "aws-cdk-lib/aws-s3";
import "source-map-support/register";

const app = new App();
const construct = new Stack(app, "test-cj-1234");

const bucketName = `test-cj-1234`;

const s3Bucket = new Bucket(construct, "Bucket", {
  blockPublicAccess: {
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true
  },
  encryption: BucketEncryption.KMS_MANAGED,
  bucketName,
  accessControl: BucketAccessControl.PRIVATE,
  cors: [
    {
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
      allowedMethods: [HttpMethods.POST, HttpMethods.GET, HttpMethods.PUT, HttpMethods.DELETE]
    }
  ]
});

app.synth();
