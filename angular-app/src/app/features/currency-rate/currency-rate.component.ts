import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '@core/currency.service';
import { FormattedCurrencyData } from '@core/currency.interface';

@Component({
  selector: 'app-currency-rate',
  templateUrl: './currency-rate.component.html',
  styleUrl: './currency-rate.component.scss',
})
export class CurrencyRateComponent implements OnInit {
  public currencyResponse: FormattedCurrencyData | null = null;
  public selectedCurrency = 'CNY';
  public calculateCurrencyRate = 1;

  public constructor(protected currencyService: CurrencyService) {}

  public ngOnInit(): void {
    this.init();
  }

  public async init(): Promise<void> {
    this.currencyResponse = await this.currencyService.getCurrencyResult();
    if (this.currencyResponse) {
      this.calculateCurrencyRate = this.getCurrencyRate(
        this.currencyResponse?.defaultExchangeCode
      );
    }
  }

  public onSelectCurrency(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCurrency = selectElement.value;
    this.calculateCurrencyRate = this.getCurrencyRate(this.selectedCurrency);
  }

  public getCurrencyRate(currency: string): number {
    const currencyRate = this.currencyResponse?.conversionRates[currency] ?? 0;
    return Math.round(currencyRate * 100) / 100;
  }
}
