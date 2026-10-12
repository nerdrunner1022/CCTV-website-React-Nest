import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';

const presignSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(120),
});

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presign')
  presign(@Body() body: unknown) {
    return this.filesService.createPresignedUpload(presignSchema.parse(body));
  }
}
