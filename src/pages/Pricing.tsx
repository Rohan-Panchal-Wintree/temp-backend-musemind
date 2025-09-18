import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PaymentModal } from "@/components/PaymentModal";
import { useUser } from "@/contexts/UserContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import axios from "axios";
import { toast } from "sonner";
import api from "@/utils/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MIN_CREDITS = 5;
const MAX_CREDITS = 1000;
const STEP = 5;
const MIN_PRICE = 10;
const MAX_PRICE = 500;

// merchant payment details
// const memberId = 15823;
// const checksum = "heulzDyq6YrH6iTcvbbZztWeO8RsCdYA";
// const totype = "Transactworld";
// const language = "ENG";
// const accountid = "2967";
// const amount = "1.00";
// const ip = "192.168.0.1";
// const paymentBrand = "VISA";
// const merchantTransactionId = "Transaction01";
// const paymentType = "DB";
// const currency = "EUR";
// const merchantRedirectUrl = "http://localhost:8080/pricing";

// payment merchantTransactionId=01234" \,paymentType=DB" \, "currency=EUR" \

const Pricing = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    credits: number;
    price: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { user } = useUser();
  const { formatPriceBase, currency: displayCurrency } = useCurrency();

  // slider state — start at min
  const [credits, setCredits] = useState<number>(MIN_CREDITS);

  const formRef = useRef<HTMLFormElement>(null);

  // linear price mapping from credits → price
  const price = useMemo(() => {
    const t = (credits - MIN_CREDITS) / (MAX_CREDITS - MIN_CREDITS); // 0..1
    const p = MIN_PRICE + t * (MAX_PRICE - MIN_PRICE);
    return Math.round(p); // round to whole dollars; change to toFixed(2) if needed
  }, [credits]);

  // const formattedPrice = formatPriceBase(price).formatted;

  const { formatted: formattedPrice, amount: convertedAmount } =
    formatPriceBase(price);

  const handleSelectPackage = async () => {
    // const pkg = { credits, price: formattedPrice };
    // setSelectedPackage(pkg);
    // setShowPayment(true);

    document.querySelector("form")?.submit();
    formRef.current?.submit();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // amount as plain numeric string with 2 decimals (e.g., "10.00")
      const amountStr = Number(convertedAmount).toFixed(2);

      const { data } = await api.post(
        `/payment/init`,
        {
          credits,
          currency: displayCurrency,
          amount: amountStr,
        },
        { withCredentials: true }
      );

      if (!data?.forwardUrl || !data?.paymentData) {
        throw new Error("Invalid response from server.");
      }

      const {
        memberId,
        amount,
        language,
        accountid,
        checksum,
        totype,
        ip,
        paymentBrand,
        merchantTransactionId,
        currency,
        merchantRedirectUrl,
        notificationUrl,
      } = data.paymentData;

      // Set form data to state to render the dynamic form
      setFormData({
        memberId,
        language,
        accountid,
        checksum,
        totype,
        amount,
        ip,
        paymentBrand,
        merchantTransactionId,
        currency,
        merchantRedirectUrl,
        forwardUrl: data.forwardUrl,
        notificationUrl,
      });
    } catch (err: any) {
      console.error("Payment init failed", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to start checkout. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }

    console.log(formattedPrice.replace(/[^\d.,-]/g, ""));
    console.log(formattedPrice.split("", 1).toString());
    console.log("payment ran ");
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setSelectedPackage(null);
  };

  useEffect(() => {
    if (formData && formRef.current) {
      formRef.current.submit();
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your{" "}
              {/* <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
                Credits
              </span> */}
              Credits
            </h1>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Pick exactly how many credits you want. Pricing scales from
              {MIN_PRICE} to {MAX_PRICE}.
            </p>
          </div>

          {/* Single Plan Card */}
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
              {/* Live Values */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl border border-purple-500/20 bg-slate-900/30 p-4 text-center">
                  <div className="text-sm text-gray-400">Selected Credits</div>
                  <div className="text-4xl font-bold text-white mt-1">
                    {credits}
                  </div>
                </div>
                <div className="rounded-xl border border-green-500/20 bg-slate-900/30 p-4 text-center">
                  <div className="text-sm text-gray-400">Price</div>
                  <div className="text-4xl font-bold text-white mt-1">
                    {formattedPrice}
                    <span className="text-base text-gray-400 font-normal ml-1">
                      one-time
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Credits
                </label>
                <input
                  type="range"
                  min={MIN_CREDITS}
                  max={MAX_CREDITS}
                  step={STEP}
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none bg-slate-700 outline-none accent-purple-500"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{MIN_CREDITS}</span>
                  <span>{MAX_CREDITS}</span>
                </div>
              </div>

              {/* Feature bullets (optional) */}
              <div className="grid sm:grid-cols-2 gap-3 mb-8 text-gray-300 text-sm">
                <div>• 1 credit per generation</div>
                <div>• High-quality MP3 downloads</div>
                <div>• Save tracks & lyrics to your profile</div>
                <div>• Credits never expire</div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handleSelectPackage}
                className="w-full h-12 font-medium bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 border-0"
              >
                Purchase {credits} Credits for {formattedPrice}
              </Button>
            </div>
          </div>

          {/* Dynamically rendered form with hidden fields */}
          {formData && (
            <form ref={formRef} method="POST" action={formData.forwardUrl}>
              <input type="hidden" name="memberId" value={formData.memberId} />
              <input type="hidden" name="language" value={formData.language} />
              <input
                type="hidden"
                name="accountid"
                value={formData.accountid}
              />
              <input type="hidden" name="checksum" value={formData.checksum} />
              <input type="hidden" name="totype" value={formData.totype} />
              <input type="hidden" name="amount" value={formData.amount} />
              <input type="hidden" name="ip" value={formData.ip} />
              <input
                type="hidden"
                name="paymentBrand"
                value={formData.paymentBrand}
              />
              <input
                type="hidden"
                name="merchantTransactionId"
                value={formData.merchantTransactionId}
              />
              <input type="hidden" name="currency" value={formData.currency} />
              <input type="hidden" name="paymentMode" value="1" />
              <input
                type="hidden"
                name="merchantRedirectUrl"
                value={formData.merchantRedirectUrl}
              />
              <input
                type="hidden"
                name="notificationUrl"
                value={formData.notificationUrl}
              />
            </form>
          )}

          {/* FAQ (kept from your page) */}
          {/* FAQ (updated) */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* NEW 3 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">
                  Can I use credits for both Music (audio) and Lyrics?
                </h3>
                <p className="text-gray-300">
                  Yes. Each generation—music or lyrics—uses 1 credit. You choose
                  what to generate each time.
                </p>
              </div>

              {/* NEW 3 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">
                  When do credits appear after payment?
                </h3>
                <p className="text-gray-300">
                  Immediately after a successful payment. If you don’t see them,
                  refresh the page; if they still don’t appear, contact support
                  with your payment reference.
                </p>
              </div>

              {/* NEW 4 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">
                  If a generation fails, do I lose a credit?
                </h3>
                <p className="text-gray-300">
                  No. We only charge for successful generations. If a credit is
                  deducted in error, it’s automatically re-credited shortly
                  after. If not, reach out to support and we’ll fix it.
                </p>
              </div>

              {/* NEW 5 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">
                  Do credits stack if I purchase multiple times?
                </h3>
                <p className="text-gray-300">
                  Yes. New purchases add to your current balance—nothing is
                  lost.
                </p>
              </div>

              {/* NEW 6 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">
                  Can I transfer credits to another account?
                </h3>
                <p className="text-gray-300">
                  Not at the moment. For team/company needs, contact support
                  about shared balances.
                </p>
              </div>

              {/* NEW 6 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">
                  Will my credits carry over if you update models or add
                  features?
                </h3>
                <p className="text-gray-300">
                  Yes. Credits don’t expire and carry over across updates. If a
                  new feature uses a different cost, we’ll state it clearly
                  before you confirm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <PaymentModal
        isOpen={showPayment}
        onClose={handlePaymentClose}
        selectedPackage={selectedPackage || undefined}
      /> */}
    </div>
  );
};

export default Pricing;
