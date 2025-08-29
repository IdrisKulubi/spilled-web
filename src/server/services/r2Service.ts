import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET = process.env.R2_BUCKET!;
const R2_ENDPOINT = process.env.R2_ENDPOINT!; // e.g. https://<accountid>.r2.cloudflarestorage.com
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL!; // e.g. https://pub-xxxx.r2.dev

// Create S3-compatible client for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `${R2_ENDPOINT}`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function createPresignedUpload({
  key,
  contentType,
  expiresInSeconds = 600,
}: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}) {
  const putCmd = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, putCmd, {
    expiresIn: expiresInSeconds,
  });

  const publicUrl = `${R2_PUBLIC_BASE_URL}/${key}`;
  return { uploadUrl, publicUrl, key };
}

