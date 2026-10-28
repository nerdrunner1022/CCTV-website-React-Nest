import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Presigned uploads to Cloudflare R2 (S3-compatible). The browser uploads
 * directly to R2 so file bytes never pass through the serverless function.
 */
@Injectable()
export class FilesService {
  async createPresignedUpload(params: {
    filename: string;
    contentType: string;
  }) {
    const {
      R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY,
      R2_BUCKET,
      R2_PUBLIC_URL,
    } = process.env;

    if (
      !R2_ACCOUNT_ID ||
      !R2_ACCESS_KEY_ID ||
      !R2_SECRET_ACCESS_KEY ||
      !R2_BUCKET
    ) {
      throw new ServiceUnavailableException('File storage is not configured');
    }

    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const key = `uploads/${Date.now()}-${sanitize(params.filename)}`;

    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        ContentType: params.contentType,
      }),
      { expiresIn: 300 },
    );

    return {
      uploadUrl,
      key,
      publicUrl: R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : null,
    };
  }
}

function sanitize(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100);
}
