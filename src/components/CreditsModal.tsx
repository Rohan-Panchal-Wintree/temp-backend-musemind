
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Check } from "lucide-react";
import { PaymentModal } from "./PaymentModal";

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal = ({ isOpen, onClose }: CreditsModalProps) => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    credits: number;
    price: number;
  } | null>(null);

  const packages = [
    { credits: 100, price: 5, popular: false },
    { credits: 500, price: 20, popular: true },
    { credits: 1000, price: 35, popular: false }
  ];

  const handlePackageSelect = (pkg: { credits: number; price: number }) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setSelectedPackage(null);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showPayment} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl bg-slate-800 border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              You're out of credits!
            </DialogTitle>
          </DialogHeader>

          <div className="text-center mb-6">
            <p className="text-gray-300 mb-4">
              You need credits to generate music. Choose a package to continue creating.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-slate-700/50 rounded-xl p-6 border transition-all hover:scale-105 cursor-pointer ${
                  pkg.popular 
                    ? "border-green-500/50 ring-2 ring-green-500/20" 
                    : "border-purple-500/20 hover:border-purple-500/40"
                }`}
                onClick={() => handlePackageSelect(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {pkg.credits}
                  </div>
                  <div className="text-gray-400 mb-4">Credits</div>
                  <div className="text-2xl font-bold text-white mb-4">
                    ${pkg.price}
                  </div>
                  
                  <Button
                    className={`w-full ${
                      pkg.popular
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    }`}
                  >
                    Select Package
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal
        isOpen={showPayment}
        onClose={handlePaymentClose}
        selectedPackage={selectedPackage || undefined}
      />
    </>
  );
};
