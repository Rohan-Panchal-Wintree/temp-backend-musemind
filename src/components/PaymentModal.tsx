import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: {
    credits: number;
    price: string;
  };
}

export const PaymentModal = ({
  isOpen,
  onClose,
  selectedPackage,
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const { addCredits } = useUser();
  const { formatPriceBase } = useCurrency();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackage) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      addCredits(selectedPackage.credits);
      setIsProcessing(false);
      toast.success(
        `Successfully purchased ${selectedPackage.credits} credits!`,
        {
          description: `$${selectedPackage.price} charged to your card`,
        }
      );
      onClose();

      // Reset form
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setNameOnCard("");
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        {selectedPackage && (
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center text-white">
              <span>{selectedPackage.credits} Credits</span>
              <span className="text-2xl font-bold">
                {selectedPackage.price}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-white">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="bg-slate-700/50 border-purple-500/30 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-white">
                Expiry Date
              </Label>
              <Input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="bg-slate-700/50 border-purple-500/30 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-white">
                CVV
              </Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="bg-slate-700/50 border-purple-500/30 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameOnCard" className="text-white">
              Name on Card
            </Label>
            <Input
              id="nameOnCard"
              type="text"
              placeholder="John Doe"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              className="bg-slate-700/50 border-purple-500/30 text-white"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                `Pay ${selectedPackage?.price}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
