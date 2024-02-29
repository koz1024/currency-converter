import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConvertDto } from '../src/converter/application/request/dtos';

describe('ConverterController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('should return a validation error: currency', async () => {
    const convertDto = {
      source: 'XXX',
      target: 'CCC',
      amount: 100,
      doubleConversion: false,
    };

    return request(app.getHttpServer()).post('/api/convert').send(convertDto).expect(400).expect({
      error: 'Bad Request: target must be a valid ISO4217 currency code',
    });
  });

  it('should return a validation error: absence of amount', async () => {
    const convertDto = {
      source: 'USD',
      target: 'EUR',
      doubleConversion: false,
    };

    return request(app.getHttpServer()).post('/api/convert').send(convertDto).expect(400).expect({
      error: 'Bad Request: amount must be a positive number, amount should not be empty',
    });
  });

  it('should return a validation error: negative amount', async () => {
    const convertDto: ConvertDto = {
      source: 'USD',
      target: 'EUR',
      amount: -100,
      doubleConversion: false,
    };

    return request(app.getHttpServer()).post('/api/convert').send(convertDto).expect(400).expect({
      error: 'Bad Request: amount must be a positive number',
    });
  });

  it('should return a domain error: currency not found', async () => {
    const convertDto: ConvertDto = {
      source: 'RUB',
      target: 'USD',
      amount: 100,
      doubleConversion: false,
    };

    return request(app.getHttpServer()).post('/api/convert').send(convertDto).expect(400).expect({
      error: 'Selected currency has not been found',
    });
  });

  it('should return something', async () => {
    const convertDto: ConvertDto = {
      source: 'UAH',
      target: 'USD',
      amount: 100,
      doubleConversion: false,
    };
    return request(app.getHttpServer()).post('/api/convert').send(convertDto).expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
