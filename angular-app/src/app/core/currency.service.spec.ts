import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';
import { CurrencyResponse, FormattedCurrencyData } from './currency.interface';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpTestingController: HttpTestingController;

  const mockCurrencyResponse: CurrencyResponse = {
    result: 'success',
    base_code: 'USD',
    time_last_update_unix: 1725148800,
    conversion_rates: {
      USD: 1,
      CNY: 7.09,
      EUR: 0.85,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService],
    });

    service = TestBed.inject(CurrencyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return result when loadCurrencyRates successed', (done) => {
    service.loadCurrencyRates().then((response) => {
      expect(response).toEqual(mockCurrencyResponse);
      done();
    });

    const req = httpTestingController.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCurrencyResponse);
  });

  it('should return result when getCurrencyResult successed', (done) => {
    const mockFormattedResponse: FormattedCurrencyData = {
      result: 'success',
      baseCode: 'USD',
      defaultExchangeCode: 'CNY',
      lastUpdateTime: '1 Sep, 2024 00:00:00 UTC',
      currencyOptions: ['USD', 'CNY', 'EUR'],
      conversionRates: {
        USD: 1,
        CNY: 7.09,
        EUR: 0.85,
      },
    };

    service.getCurrencyResult().then((response) => {
      expect(response).toEqual(mockFormattedResponse);
      done();
    });

    const req = httpTestingController.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCurrencyResponse);
  });

  it('should return null when getCurrencyResult result is error', (done) => {
    const mockErrorResponse = {
      result: 'error',
      'error-type': 'invalid-key',
    };

    service.getCurrencyResult().then((response) => {
      expect(response).toBeNull();
      done();
    });

    const req = httpTestingController.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockErrorResponse);
  });

  it('should return null when getCurrencyResult has an error', (done) => {
    service.getCurrencyResult().then((response) => {
      expect(response).toBeNull();
      done();
    });

    const req = httpTestingController.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should format a valid timestamp correctly', () => {
    const timestamp = 1725148800;
    const formattedDate = service.formatTimestamp(timestamp);
    expect(formattedDate).toBe('1 Sep, 2024 00:00:00 UTC');
  });
});
