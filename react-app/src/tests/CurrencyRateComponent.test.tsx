import { render } from "@testing-library/react";
import { CurrencyRateComponent } from "../components/CurrencyRate/CurrencyRate";

describe("CurrencyRateComponent", () => {
  it("render correctly", () => {
    render(<CurrencyRateComponent />);
  });
});
