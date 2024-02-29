import { Injectable } from '@nestjs/common';
import { RateService } from './rate.service';
import { CurrencyService } from '../../../currency/currency.service';
import { RateUpdaterService } from './rate.updater.service';
import { CurrencyNotFoundError } from '../../domain/errors';
import { ConvertResultInterface } from '../request/interfaces';

@Injectable()
export class ConvertService {
  constructor(
    private readonly rateService: RateService,
    private readonly rateUpdaterService: RateUpdaterService,
    private readonly currencyService: CurrencyService,
  ) {}

  async convertByNumCode(
    currencyNumCodeFrom: number,
    currencyNumCodeTo: number,
    amount: number,
    isCrossEnabled = true,
  ): Promise<ConvertResultInterface> {
    if (!(await this.rateUpdaterService.isExists())) {
      await this.rateUpdaterService.forceUpdate();
    }
    const currencyFrom = this.currencyService.getCurrencyByNumCode(currencyNumCodeFrom);
    const currencyTo = this.currencyService.getCurrencyByNumCode(currencyNumCodeTo);
    if (!currencyFrom || !currencyTo) {
      throw new CurrencyNotFoundError();
    }

    const rate = await this.rateService.getRate(currencyFrom, currencyTo, isCrossEnabled);
    return {
      amount: this.round(amount * rate.rate),
      rate: rate.rate,
      isDoubleConverted: rate.isDoubleConverted,
    };
  }

  async convertByCharCode(
    currencyCharCodeFrom: string,
    currencyCharCodeTo: string,
    amount: number,
    isCrossEnabled = true,
  ): Promise<ConvertResultInterface> {
    if (!(await this.rateUpdaterService.isExists())) {
      await this.rateUpdaterService.forceUpdate();
    }
    const currencyFrom = this.currencyService.getCurrencyByCode(currencyCharCodeFrom);
    const currencyTo = this.currencyService.getCurrencyByCode(currencyCharCodeTo);
    if (!currencyFrom || !currencyTo) {
      throw new CurrencyNotFoundError();
    }

    const rate = await this.rateService.getRate(
      currencyFrom,
      currencyTo,
      isCrossEnabled,
    );
    return {
      amount: this.round(amount * rate.rate),
      rate: rate.rate,
      isDoubleConverted: rate.isDoubleConverted,
    };
  }

  private round(amount: number) {
    return Math.round(amount * 100) / 100;
  }
}
