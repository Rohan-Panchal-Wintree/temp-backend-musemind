import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// import { toast } from "sonner";

// --- Types ---
type CurrencyCode = "USD" | "EUR";
type Rates = Record<CurrencyCode, number>;

interface CurrencyContextType {
  // Display currency the user wants to see
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;

  // Base/authoring currency for your app pricing (default USD)
  baseCurrency: CurrencyCode;
  setBaseCurrency: (c: CurrencyCode) => Promise<void>;

  // Exchange rates where baseCurrency === 1
  exchangeRates: Rates;
  refreshExchangeRates: (base?: CurrencyCode) => Promise<void>;

  // Convert an amount authored in baseCurrency to the selected display currency
  formatPriceBase: (amountInBase: number) => {
    amount: number;
    formatted: string;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Storage keys ---
const CURRENCY_KEY = "app_currency"; // display currency

// --- Context ---
const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// --- Provider ---
export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Display currency state (persists)
  const [currency, _setCurrency] = useState<CurrencyCode>(() => {
    try {
      return (localStorage.getItem(CURRENCY_KEY) as CurrencyCode) ?? "EUR";
    } catch {
      return "USD";
    }
  });

  // Base (authoring) currency state (persists)
  const [baseCurrency, _setBaseCurrency] = useState<CurrencyCode>("USD");

  // Exchange rates (persist table of { base, rates })
  const [exchangeRates, setExchangeRates] = useState<Rates>({ USD: 1, EUR: 1 });

  // Optional if persisting the exchange rates in local storage
  // const persistRates = (base: CurrencyCode, rates: Rates) => {
  //   try {
  //     localStorage.setItem(RATES_KEY, JSON.stringify({ base, rates }));
  //   } catch {}
  // };

  const setCurrency = (c: CurrencyCode) => {
    _setCurrency(c);
    try {
      localStorage.setItem(CURRENCY_KEY, c);
    } catch {}
  };

  const refreshExchangeRates = useCallback(async () => {
    // Only USD/EUR
    const { data } = await axios.get(`${BASE_URL}/pricing/config`, {
      withCredentials: true,
    });
    if (!data?.success) throw new Error("Failed to fetch rates");

    const cfg = data.data as {
      baseCurrency: CurrencyCode;
      exchangeRates: Rates;
    };
    _setBaseCurrency(cfg.baseCurrency);
    setExchangeRates(cfg.exchangeRates);
  }, []);

  const setBaseCurrency = async (c: CurrencyCode) => {
    // Rebase instantly for snappy UX, then refresh live
    _setBaseCurrency(c);
    await refreshExchangeRates();
  };

  const formatPriceBase = useCallback(
    (amountInBase: number) => {
      const rate = exchangeRates[currency] ?? 1; // displayCurrency per 1 base
      const amount = amountInBase * rate;

      // console.log(rate, amount, amountInBase);

      const formatted = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
      return { amount, formatted };
    },
    [currency, exchangeRates]
  );

  //Provide a value that changes when state changes
  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      baseCurrency,
      setBaseCurrency,
      exchangeRates,
      refreshExchangeRates,
      formatPriceBase,
    }),
    [
      currency,
      baseCurrency,
      exchangeRates,
      formatPriceBase,
      refreshExchangeRates,
    ]
  );

  useEffect(() => {
    refreshExchangeRates().catch(() => {});
  }, [refreshExchangeRates]);

  useEffect(() => {
    if (!exchangeRates[currency]) {
      _setCurrency(baseCurrency);
    }
  }, [baseCurrency, exchangeRates, currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// --- Hook ---
export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx)
    throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
};
