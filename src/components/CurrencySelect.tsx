import React from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

const CurrencySelect: React.FC<{
  className?: string;
  showRefresh?: boolean;
}> = ({ className = "", showRefresh = false }) => {
  const { currency, setCurrency, refreshExchangeRates } = useCurrency();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as "USD" | "EUR")}
        className="h-10 rounded-md bg-slate-700/50 border border-purple-500/30 text-white px-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <option value="EUR">EUR (€)</option>
        <option value="USD">USD ($)</option>
      </select>

      {showRefresh && (
        <button
          onClick={() => refreshExchangeRates()}
          className="text-xs text-purple-300 underline hover:text-purple-200"
          title="Refresh exchange rates"
        >
          Refresh
        </button>
      )}
    </div>
  );
};

export default CurrencySelect;
