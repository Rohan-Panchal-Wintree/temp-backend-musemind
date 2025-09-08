import { PricingConfig } from "../models/pricingConfig.model.js";

// GET /pricing/config
async function getPricingConfig(_req, res) {
  try {
    let cfg = await PricingConfig.findOne({});
    if (!cfg) {
      cfg = await PricingConfig.create({
        baseCurrency: "USD",
        exchangeRates: { USD: 1, EUR: 0.92 },
      });
    }

    return res.json({
      success: true,
      data: {
        baseCurrency: cfg.baseCurrency,
        exchangeRates: cfg.exchangeRates,
        updatedAt: cfg.updatedAt,
      },
    });
  } catch (e) {
    console.error("getPricingConfig error", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

export default getPricingConfig;
