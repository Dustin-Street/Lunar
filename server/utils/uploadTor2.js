import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2Client.js";
import crypto from "crypto";

export async function uploadToR2(fileBuffer, mimeType, userId) {
  const key = `${userId}/${crypto.randomUUID()}`;

  console.log("Uploading file to R2 with key:", key);
  console.log("File buffer size:", fileBuffer);
  //inspect the file buffer and mime type
  console.log("MIME type:", mimeType);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await r2.send(command);

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
