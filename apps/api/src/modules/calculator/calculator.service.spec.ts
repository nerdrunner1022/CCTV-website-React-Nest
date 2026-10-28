import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  const service = new CalculatorService();

  it('suggests a basic kit for a small indoor home', () => {
    const result = service.estimate({
      propertyType: 'HOME',
      entrances: 4,
      coverage: 'INDOOR',
      budget: 'LOW',
      existingCameras: false,
    });

    expect(result.cameraCount).toBe(3);
    expect(result.suggestedPackage).toBe('Basic Kit');
    expect(result.priceMin).toBeLessThan(result.priceMax);
  });

  it('scales up for a warehouse', () => {
    const result = service.estimate({
      propertyType: 'WAREHOUSE',
      entrances: 6,
      coverage: 'OUTDOOR',
      budget: 'MID',
      existingCameras: false,
    });

    expect(result.cameraCount).toBe(8);
    expect(result.suggestedPackage).toBe('Recommended Kit');
  });
});
