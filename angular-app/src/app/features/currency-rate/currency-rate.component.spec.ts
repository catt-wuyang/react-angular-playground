import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyService } from '@core/currency.service';
import { CurrencyRateComponent } from './currency-rate.component';
import { FormattedCurrencyData } from '@core/currency.interface';

describe('CurrencyRateComponent', () => {
  let component: CurrencyRateComponent;
  let fixture: ComponentFixture<CurrencyRateComponent>;
  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;

  const mockCurrencyResponse = {
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

  beforeEach(async () => {
    const currencySpy = jasmine.createSpyObj('CurrencyService', [
      'getCurrencyResult',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CurrencyRateComponent],
      providers: [{ provide: CurrencyService, useValue: currencySpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyRateComponent);
    component = fixture.componentInstance;
    currencyServiceSpy = TestBed.inject(
      CurrencyService
    ) as jasmine.SpyObj<CurrencyService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call init in ngOnInit', async () => {
    spyOn(component, 'init').and.callThrough();
    component.ngOnInit();
    expect(component.init).toHaveBeenCalled();
  });

  it('should set calculateCurrencyRate in init', async () => {
    currencyServiceSpy.getCurrencyResult.and.returnValue(
      Promise.resolve(mockCurrencyResponse as FormattedCurrencyData)
    );

    await component.init();
    expect(component.calculateCurrencyRate).toEqual(7.09);
  });

  it('should update selectedCurrency and set calculateCurrencyRate when currency is selected', async () => {
    currencyServiceSpy.getCurrencyResult.and.returnValue(
      Promise.resolve(mockCurrencyResponse as FormattedCurrencyData)
    );

    await component.init();

    const selectElement = document.createElement('select');
    const option = document.createElement('option');
    option.value = 'EUR';
    option.text = 'EUR';
    selectElement.appendChild(option);
    selectElement.value = 'EUR';

    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: selectElement });

    component.onSelectCurrency(event);

    expect(component.selectedCurrency).toBe('EUR');
    expect(component.calculateCurrencyRate).toBe(0.85);
  });

  it('should return 0 if currencyResponse is null', () => {
    currencyServiceSpy.getCurrencyResult.and.returnValue(Promise.resolve(null));

    const rate = component.getCurrencyRate('USD');
    expect(rate).toBe(0);
  });
});
