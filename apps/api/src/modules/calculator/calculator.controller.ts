import { Body, Controller, Post } from '@nestjs/common';
import { calculatorInputSchema } from '@cctv/shared';
import { CalculatorService } from './calculator.service';

@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('estimate')
  estimate(@Body() body: unknown) {
    return this.calculatorService.estimate(calculatorInputSchema.parse(body));
  }
}
