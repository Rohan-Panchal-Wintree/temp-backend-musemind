import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PaymentModal } from "@/components/PaymentModal";
import { toast } from "sonner";
import { Check, CreditCard } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Credits = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    credits: number;
    price: number;
  } | null>(null);
  const { user } = useUser();

  const pricingTiers = [
    {
      id: "tier-1",
      credits: 100,
      price: 5,
      popular: false,
      features: ["100 Music Generations", "Standard Quality", "Basic Support"],
    },
    {
      id: "tier-2",
      credits: 500,
      price: 20,
      popular: true,
      features: [
        "500 Music Generations",
        "High Quality",
        "Priority Support",
        "Extended Track Length",
      ],
    },
    {
      id: "tier-3",
      credits: 1000,
      price: 35,
      popular: false,
      features: [
        "1000 Music Generations",
        "Ultra Quality",
        "VIP Support",
        "Commercial License",
        "Advanced Features",
      ],
    },
  ];

  const handlePurchase = (tier: { credits: number; price: number }) => {
    setSelectedPackage(tier);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Buy More Credits
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Purchase credits to generate AI music
            </p>

            {/* Current Credits Display */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20">
              <span className="text-3xl">🎵</span>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">
                  {user?.credits || 0}
                </div>
                <div className="text-sm text-gray-400">Current Credits</div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                  tier.popular
                    ? "border-green-500/50 ring-2 ring-green-500/20"
                    : "border-purple-500/20"
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-2">
                    {tier.credits}
                  </div>
                  <div className="text-gray-400 mb-4">Credits</div>
                  <div className="text-3xl font-bold text-white">
                    ${tier.price}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={() =>
                    handlePurchase({ credits: tier.credits, price: tier.price })
                  }
                  className={`w-full h-12 font-medium transition-all ${
                    tier.popular
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Buy Credits
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-2">
                  How do credits work?
                </h3>
                <p className="text-gray-300">
                  Each music generation uses 1 credit. Credits never expire and
                  can be used at any time.
                </p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-2">
                  Can I get a refund?
                </h3>
                <p className="text-gray-300">
                  Yes, we offer a 30-day money-back guarantee if you're not
                  satisfied with our service.
                </p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-2">
                  Is there a monthly subscription?
                </h3>
                <p className="text-gray-300">
                  No, we use a pay-as-you-go credit system. Only pay for what
                  you use, when you use it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <PaymentModal
        isOpen={showPayment}
        onClose={() => {
          setShowPayment(false);
          setSelectedPackage(null);
        }}
        selectedPackage={selectedPackage || undefined}
      /> */}
    </div>
  );
};

export default Credits;
