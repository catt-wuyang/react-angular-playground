export interface CurrencyResponse {
  result: 'success' | 'error';
  base_code: string;
  time_last_update_unix: number;
  conversion_rates: {
    [currencyCode: string]: number;
  };
}

export interface FormattedCurrencyData {
  result: 'success' | 'error';
  baseCode: string;
  defaultExchangeCode: string;
  lastUpdateTime: string;
  currencyOptions: string[];
  conversionRates: {
    [currencyCode: string]: number;
  };
}
