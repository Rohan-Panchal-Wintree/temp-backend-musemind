import mongoose from "mongoose";

const pricingConfigSchema = new mongoose.Schema(
  {
    baseCurrency: {
      type: String,
      enum: ["USD", "EUR"],
      required: true,
      default: "USD",
    },

    exchangeRates: {
      USD: { type: Number, required: true, default: 1 },
      EUR: { type: Number, required: true, default: 0.92 },
    },
  },
  { timestamps: true }
);

pricingConfigSchema.pre("save", function (next) {
  const doc = this;
  const base = doc.baseCurrency || "USD";

  const currentBaseVal =
    doc.exchangeRates && typeof doc.exchangeRates[base] === "number"
      ? doc.exchangeRates[base]
      : 1;

  const factor = currentBaseVal ? 1 / currentBaseVal : 1;

  ["USD", "EUR"].forEach((c) => {
    const val =
      doc.exchangeRates && typeof doc.exchangeRates[c] === "number"
        ? doc.exchangeRates[c]
        : 1;

    doc.exchangeRates[c] = Number(val * factor);
  });

  doc.exchangeRates[base] = 1;
  next();
});

const PricingConfig =
  mongoose.models.PricingConfig ||
  mongoose.model("PricingConfig", pricingConfigSchema);

export { PricingConfig };
