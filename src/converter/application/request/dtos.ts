import { IsBoolean, IsISO4217CurrencyCode, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertDto {
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ example: 48.23, description: 'Amount of funds to convert', type: 'number', format: 'float' })
  amount: number;

  @IsNotEmpty()
  @IsISO4217CurrencyCode()
  @ApiProperty({ example: 'USD', description: 'Alphabetic code of source currency', type: 'string' })
  source: string;

  @IsNotEmpty()
  @IsISO4217CurrencyCode()
  @ApiProperty({ example: 'EUR', description: 'Alphabetic code of target currency', type: 'string' })
  target: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, description: 'To use or not the double conversion', type: 'boolean' })
  doubleConversion: boolean;
}

export class ConvertResultDto {
  @ApiProperty({ example: 42.88, description: 'Resulted amount of funds', type: 'number', format: 'float' })
  amount: number;
  @ApiProperty({ example: 0.0123, description: 'Conversion rate', type: 'number', format: 'float' })
  rate: number;
  @ApiProperty({ example: false, description: 'Is double conversion used', type: 'boolean' })
  isDoubleConverted: boolean;
}