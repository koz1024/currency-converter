import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RateCacheInterface } from '../../interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateUpdaterService {
  private updateInterval = 24 * 60 * 60 * 1000; // 24 hours by default
  private readonly URL = 'https://api.monobank.ua/bank/currency';
  private readonly LAST_UPDATE_DATE_KEY = 'lastUpdateDate';
  private readonly logger = new Logger(RateUpdaterService.name);
  private isRunning = false;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    const updateInterval = this.configService.get<number>('UPDATE_INTERVAL');
    if (updateInterval) {
      //update interval in config is in minutes, convert to ms
      this.updateInterval = updateInterval * 60 * 1000;
    }
  }

  @Cron('0 * * * * *')
  async update() {
    const lastUpdateDate = await this.getLastUpdateDate();
    if (!this.isRunning && lastUpdateDate.getTime() + this.updateInterval < Date.now()) {
      this.isRunning = true;
      await this.action();
      this.isRunning = false;
    }
  }

  async forceUpdate() {
    if (this.isRunning) {
      return new Promise<void>((resolve, _reject) => {
        const interval = setInterval(() => {
          if (!this.isRunning) {
            clearInterval(interval);
            resolve();
          }
        }, 0);
      });
    }
    this.isRunning = true;
    await this.action();
    this.isRunning = false;
  }

  async isExists() {
    return !!(await this.cacheManager.get(this.LAST_UPDATE_DATE_KEY));
  }

  private async getLastUpdateDate(): Promise<Date> {
    const lastUpdatedDate = await this.cacheManager.get<number>(
      this.LAST_UPDATE_DATE_KEY,
    );
    return new Date(lastUpdatedDate ?? 0);
  }

  private async action() {
    let response: Response;
    let data;
    try {
      response = await fetch(this.URL);
      data = await response.json();
      await Promise.all(
        data.map((rate) => {
          const rateCacheKey = `${rate.currencyCodeA}`;
          const rateCacheValue: RateCacheInterface = {
            buy: rate.rateBuy,
            sell: rate.rateSell,
            cross: rate.rateCross,
            date: rate.date,
          };
          return this.cacheManager.set(rateCacheKey, rateCacheValue);
        }),
      );
      await this.cacheManager.set(this.LAST_UPDATE_DATE_KEY, Date.now());
      this.logger.log(`Rates have been updated at ${new Date()}`);
    } catch (e) {
      this.logger.error(`Error during rates update: ${e.message}`);
      this.logger.log(
        `Monobank response status: ${response.status},\n` +
          `headers: ${JSON.stringify(response.headers)},\n` +
          `data: ${JSON.stringify(data)}`,
      );
    }
  }
}
