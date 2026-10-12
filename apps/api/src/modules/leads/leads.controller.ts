import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { createLeadSchema } from '@cctv/shared';
import { LeadsService } from './leads.service';

/** Public survey booking endpoint. */
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: unknown) {
    return this.leadsService.create(createLeadSchema.parse(body));
  }
}
