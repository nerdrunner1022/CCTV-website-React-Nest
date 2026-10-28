import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { QuotesService } from './quotes.service';

 /** Staff-only quote management endpoints. */
@Controller('admin/quotes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SALES')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  list() {
    return this.quotesService.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.quotesService.get(id);
  }

  @Post('lead/:leadId')
  createForLead(@Param('leadId') leadId: string, @Body() body: { items: { productId: string; quantity: number }[] }) {
    return this.quotesService.createLeadQuote(leadId, body.items);
  }
}