import { Injectable } from '@nestjs/common';
import type { CalculatorInput, CalculatorResult } from '@cctv/shared';

/**
 * Deterministic rule engine behind the camera calculator. No AI — the same
 * answers always produce the same suggestion, which keeps quotes defensible.
 */
@Injectable()
export class CalculatorService {
  estimate(input: CalculatorInput): CalculatorResult {
    let cameraCount: number;

    switch (input.coverage) {
      case 'INDOOR':
        cameraCount = Math.max(1, Math.round(input.entrances * 0.75));
        break;
      case 'MIXED':
        cameraCount = input.entrances + 1;
        break;
      default:
        cameraCount = input.entrances;
    }

    if (input.propertyType === 'WAREHOUSE') cameraCount += 2;
    if (input.propertyType === 'HOME') cameraCount = Math.min(cameraCount, 8);
    if (input.existingCameras) cameraCount = Math.max(1, cameraCount - 1);

    const perCamera =
      input.budget === 'LOW' ? 120 : input.budget === 'HIGH' ? 260 : 180;

    const priceMin = cameraCount * perCamera;
    const priceMax = Math.round(priceMin * 1.4);

    const suggestedPackage =
      cameraCount <= 4
        ? 'Basic Kit'
        : cameraCount <= 8
          ? 'Recommended Kit'
          : 'Premium Kit';

    return {
      suggestedPackage,
      cameraCount,
      priceMin,
      priceMax,
      currency: 'USD',
      rationale: [
        `${cameraCount} camera${cameraCount === 1 ? '' : 's'} suggested for a ${input.propertyType.toLowerCase()} with ${input.entrances} entrance(s).`,
        `Coverage profile: ${input.coverage.toLowerCase()}.`,
        `Indicative range based on a ${input.budget.toLowerCase()} budget.`,
      ],
    };
  }
}
