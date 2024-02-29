import { Module } from '@nestjs/common';
import { ConverterController } from './application/converter.controller';
import { RateUpdaterService } from './application/services/rate.updater.service';
import { ConvertService } from './application/services/convert.service';
import { RateService } from './application/services/rate.service';
import { CurrencyService } from '../currency/currency.service';

@Module({
  controllers: [ConverterController],
  providers: [RateUpdaterService, ConvertService, RateService, CurrencyService],
  imports: [CurrencyService],
})
export class ConverterModule {}
