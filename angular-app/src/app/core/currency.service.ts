import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CurrencyResponse, FormattedCurrencyData } from './currency.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly apiKey = '1bd6365dd3c9bbaa9e99fbda';
  private readonly baseUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}`;
  public readonly baseCode = 'USD';
  public readonly exchangeCode = 'CNY';

  private apiUrl = `${this.baseUrl}/latest/${this.baseCode}`;

  public constructor(private httpClient: HttpClient) {}

  public async loadCurrencyRates(): Promise<CurrencyResponse> {
    return firstValueFrom(this.httpClient.get<CurrencyResponse>(this.apiUrl));
  }

  public async getCurrencyResult(): Promise<FormattedCurrencyData | null> {
    try {
      const response = await this.loadCurrencyRates();
      if (response.result === 'success') {
        return {
          result: response.result,
          baseCode: this.baseCode,
          defaultExchangeCode: this.exchangeCode,
          lastUpdateTime: this.formatTimestamp(response.time_last_update_unix),
          currencyOptions: Object.keys(response.conversion_rates),
          conversionRates: response.conversion_rates,
        };
      }

      return null;
    } catch (error: unknown) {
      return null;
    }
  }

  public formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${day} ${month}, ${year} ${hours}:${minutes}:${seconds} UTC`;
  }
}
