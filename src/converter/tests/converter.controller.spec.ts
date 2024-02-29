import { Test, TestingModule } from '@nestjs/testing';
import { ConverterController } from '../application/converter.controller';
import { ConvertService } from '../application/services/convert.service';
import { ConvertDto } from '../application/request/dtos';
import { DomainError } from '../domain/errors';

describe('ConverterController', () => {
  let converterController: ConverterController;
  let convertService: ConvertService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ConverterController],
      providers: [ConvertService],
    })
      .overrideProvider(ConvertService)
      .useValue({
        convertByCharCode: jest.fn(),
      })
      .compile();

    convertService = moduleRef.get<ConvertService>(ConvertService);
    converterController = moduleRef.get<ConverterController>(ConverterController);
  });

  describe('convert', () => {
    it('should return conversion result', async () => {
      const convertDto: ConvertDto = {
        source: 'USD',
        target: 'EUR',
        amount: 100,
        doubleConversion: true,
      };
      const result = { amount: 90, rate: 0.9, isDoubleConverted: true };

      jest.spyOn(convertService, 'convertByCharCode').mockImplementation(async () => result);

      expect(await converterController.convert(convertDto)).toEqual(result);
    });
  });
});
