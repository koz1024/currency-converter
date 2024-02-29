import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Currency, CurrencyService } from '../../../currency/currency.service';
import { DoubleConversionDisabledError, CurrencyNotFoundError, ExternalCurrencyNotFoundError } from '../../domain/errors';
import { RateCacheInterface, RateInterface } from '../../interfaces';

@Injectable()
export class RateService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private currencySvc: CurrencyService,
  ) {}

  async getRate(
    sourceCurrency: Currency,
    targetCurrency: Currency,
    isDoubleEnabled = true,
  ): Promise<RateInterface> {
    if (this.currencySvc.isBaseCurrency(sourceCurrency) || this.currencySvc.isBaseCurrency(targetCurrency)) {
      return this.getDirectRate(sourceCurrency, targetCurrency);
    } else if (isDoubleEnabled) {
      return this.getCrossRate(sourceCurrency, targetCurrency);
    } else {
      throw new DoubleConversionDisabledError();
    }
  }

  private async getDirectRate(
    sourceCurrency: Currency,
    targetCurrency: Currency,
  ) {
    const rateCacheKey = this.currencySvc.isBaseCurrency(sourceCurrency)
      ? `${targetCurrency.numCode}`
      : `${sourceCurrency.numCode}`;
    const rateCached = await this.cacheManager.get<RateCacheInterface>(rateCacheKey);
    if (!rateCached) {
      throw new ExternalCurrencyNotFoundError();
    }
    return this.resolveRate(rateCached, this.currencySvc.isBaseCurrency(sourceCurrency) ? 'sell' : 'buy');
  }

  private resolveRate(rateCached, rateType: 'sell' | 'buy') {
    if (rateType === 'sell') {
      if (rateCached.sell) {
        return { rate: 1 / rateCached.sell, isDoubleConverted: false };
      } else if (rateCached.cross) {
        return { rate: 1 / rateCached.cross, isDoubleConverted: false };
      } else {
        throw new ExternalCurrencyNotFoundError();
      }
    } else if (rateType === 'buy') {
      if (rateCached.buy) {
        return { rate: rateCached.buy, isDoubleConverted: false };
      } else if (rateCached.cross) {
        return { rate: rateCached.cross, isDoubleConverted: false };
      } else {
        throw new ExternalCurrencyNotFoundError();
      }
    } else {
      throw new Error('Unknown rate type');
    }
  }

  private async getCrossRate(
    sourceCurrency: Currency,
    targetCurrency: Currency,
  ) {
    const rateAToBase = await this.getRate(
      sourceCurrency,
      this.currencySvc.getBaseCurrency(),
    );
    const rateBaseToB = await this.getRate(
      this.currencySvc.getBaseCurrency(),
      targetCurrency,
    );
    if (!rateAToBase || !rateBaseToB) {
      throw new CurrencyNotFoundError();
    }
    return { rate: rateAToBase.rate * rateBaseToB.rate, isDoubleConverted: true };
  }
}
