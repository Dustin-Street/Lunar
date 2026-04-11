import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_END_POINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_R2,
    secretAccessKey: process.env.SECRET_KEY_R2,
  },
});
