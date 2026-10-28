import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SurveysService } from './surveys.service';
import { createSurveySchema } from '@cctv/shared';

 /** Staff-only survey scheduling endpoints. */
@Controller('admin/surveys')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SALES')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Get()
  list() {
    return this.surveysService.list();
  }

  @Post()
  create(@Body() body: unknown) {
    return this.surveysService.create(createSurveySchema.parse(body));
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.surveysService.get(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.surveysService.updateStatus(id, status as any);
  }
}