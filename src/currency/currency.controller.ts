import { Controller, Get } from '@nestjs/common';
import { Currency, CurrencyService } from './currency.service';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

export class CurrencyDto implements Currency {
  @ApiProperty({ example: 840, description: 'Numeric code of currency', type: 'number' })
  numCode: number;
  @ApiProperty({ example: 'USD', description: 'Alphabetic code of currency', type: 'string' })
  code: string;
  @ApiProperty({ example: 'US Dollar', description: 'Name of currency', type: 'string' })
  name: string;
  @ApiProperty({ example: true, description: 'Is currency enabled', type: 'boolean' })
  enabled: boolean;
}

@Controller('/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available currencies' })
  @ApiResponse({ status: 200, description: 'List of available currencies', type: [CurrencyDto] })
  list(): Currency[] {
    return this.currencyService.list();
  }
}
