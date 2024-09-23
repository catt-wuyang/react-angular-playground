import React, { useState, useEffect } from "react";
import { FormattedCurrencyData } from "src/types/currency.interface";
import { getCurrencyResult } from "@services/currency";
import "./currency-rate.scss";

export function CurrencyRateComponent() {
  const [currencyResponse, setCurrencyResponse] =
    useState<FormattedCurrencyData | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState("CNY");
  const [currencyRate, setCurrencyRate] = useState(1);

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  async function fetchCurrencyData() {
    const response = await getCurrencyResult();
    if (response) {
      setCurrencyResponse(response);
      const rate = getCurrencyRate(
        response.defaultExchangeCode,
        response.conversionRates
      );
      setCurrencyRate(rate);
    }
  }

  function onSelectCurrency(event: React.ChangeEvent<HTMLSelectElement>): void {
    const selectedValue = event.target.value;
    setSelectedCurrency(selectedValue);

    if (currencyResponse) {
      const rate = getCurrencyRate(
        selectedValue,
        currencyResponse.conversionRates
      );
      setCurrencyRate(rate);
    }
  }

  function getCurrencyRate(
    currency: string,
    conversionRates: {
      [currencyCode: string]: number;
    }
  ): number {
    const currencyRate = conversionRates[currency] ?? 0;
    return Math.round(currencyRate * 100) / 100;
  }

  if (!currencyResponse) {
    return null;
  }

  return (
    <div className="app-currency-component">
      <div className="base-currency">1 USD exchanges</div>

      <div className="exchange-currency">
        {`${currencyRate} ${selectedCurrency}`}
      </div>

      <div className="update-date">
        {currencyResponse?.lastUpdateTime} update from {""}
        <a href="https://www.exchangerate-api.com/">ExchangeRate-API</a>
      </div>

      <div className="currency-selection">
        <div className="select-currency-rate">{currencyRate}</div>

        <select
          value={selectedCurrency}
          onChange={onSelectCurrency}
          className="select-currency"
        >
          {Object.entries(currencyResponse.conversionRates).map(
            ([currency, rate]) => (
              <option key={`currency_${currency}`} value={selectedCurrency}>
                {currency}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}
