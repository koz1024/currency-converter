import { Body, Controller, Logger, Post, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ConvertResultErrorInterface, ConvertResultInterface } from './interfaces';
import { DomainError } from './errors';
import { ConvertDto, ConvertResultDto } from './dtos';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DomainExceptionFilter } from './domain-exception.filter';
import { HttpExceptionFilter } from "./http-exception.filter";

@Controller('convert')
export class ConverterController {
  private readonly logger = new Logger(ConverterController.name);
  constructor(private readonly svc: ConvertService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(new DomainExceptionFilter())
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Conversion endpoint' })
  @ApiResponse({ status: 201, description: 'Conversion result', type: ConvertResultDto })
  async convert(@Body() body: ConvertDto): Promise<ConvertResultInterface|ConvertResultErrorInterface> {
    // try {
      const result = await this.svc.convertByCharCode(
        body.source,
        body.target,
        body.amount,
        body.doubleConversion,
      );
      this.logger.log({ input: body, output: result });
      return result;
    // } catch (e) {
    //   this.logger.warn({ input: body, error: e.message });
    //   if (e instanceof DomainError) {
    //     return { error: e.message };
    //   } else {
    //     return { error: 'Internal server error' };
    //   }
    // }
  }
}
