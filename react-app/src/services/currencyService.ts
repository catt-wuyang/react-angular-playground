import axios from "axios";
import {
  CurrencyResponse,
  FormattedCurrencyData,
} from "src/types/currency.interface";

const apiKey = "1bd6365dd3c9bbaa9e99fbda";
const baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}`;
const baseCode = "USD";

export async function loadCurrencyRates(): Promise<CurrencyResponse> {
  const apiUrl = `${baseUrl}/latest/${baseCode}`;
  const response = await axios.get<CurrencyResponse>(apiUrl);
  return response.data;
}

export async function getCurrencyResult(): Promise<FormattedCurrencyData | null> {
  try {
    const response = await loadCurrencyRates();
    if (response.result === "success") {
      return {
        result: response.result,
        baseCode,
        defaultExchangeCode: "CNY",
        lastUpdateTime: formatTimestamp(response.time_last_update_unix),
        currencyOptions: Object.keys(response.conversion_rates),
        conversionRates: response.conversion_rates,
      };
    }

    return null;
  } catch (error: unknown) {
    return null;
  }
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getUTCFullYear();

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${day} ${month}, ${year} ${hours}:${minutes}:${seconds} UTC`;
}
