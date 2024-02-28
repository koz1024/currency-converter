import { Module } from '@nestjs/common';
import { ConverterController } from './converter.controller';
import { RateUpdaterService } from './rate.updater.service';
import { ConvertService } from './convert.service';
import { RateService } from './rate.service';
import { CurrencyService } from '../currency/currency.service';

@Module({
  controllers: [ConverterController],
  providers: [RateUpdaterService, ConvertService, RateService, CurrencyService],
  imports: [CurrencyService],
})
export class ConverterModule {}
