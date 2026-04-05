import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomBytes } from "crypto";

@Injectable()
export class StorageService {
  private readonly client: S3Client | null;
  private readonly bucket: string | null;
  private readonly publicBase: string | null;

  constructor(private readonly config: ConfigService) {
    const accountId = config.get<string>("R2_ACCOUNT_ID");
    const accessKeyId = config.get<string>("R2_ACCESS_KEY_ID");
    const secretAccessKey = config.get<string>("R2_SECRET_ACCESS_KEY");
    const bucket = config.get<string>("R2_BUCKET_NAME");
    if (accountId && accessKeyId && secretAccessKey && bucket) {
      this.client = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
      });
      this.bucket = bucket;
    } else {
      this.client = null;
      this.bucket = null;
    }
    this.publicBase = config.get<string>("R2_PUBLIC_BASE_URL") ?? null;
  }

  assertConfigured() {
    if (!this.client || !this.bucket) {
      throw new ServiceUnavailableException(
        "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME.",
      );
    }
  }

  buildObjectKey(userId: string, originalName: string) {
    const safe = originalName.replace(/[^\w.\-]+/g, "_").slice(0, 180);
    const suffix = randomBytes(8).toString("hex");
    return `uploads/${userId}/${Date.now()}-${suffix}-${safe}`;
  }

  async putObject(key: string, body: Buffer, contentType?: string) {
    this.assertConfigured();
    await this.client!.send(
      new PutObjectCommand({
        Bucket: this.bucket!,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  /** Returns a time-limited URL to download the object. */
  async getDownloadUrl(key: string, expiresSeconds = 900) {
    this.assertConfigured();
    if (this.publicBase) {
      const base = this.publicBase.replace(/\/$/, "");
      return `${base}/${encodeURI(key)}`;
    }
    const cmd = new GetObjectCommand({ Bucket: this.bucket!, Key: key });
    return getSignedUrl(this.client!, cmd, { expiresIn: expiresSeconds });
  }
}
