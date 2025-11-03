import { useState } from 'react';
import { X, AlertCircle, Gift as GiftIcon, Loader2 } from 'lucide-react';
import { sendGiftToLead } from '@mumbies/shared/lib/gifts';
import { Button } from '@mumbies/shared';

interface Lead {
  id: string;
  email: string;
  name?: string;
}

interface SendGiftModalProps {
  lead: Lead;
  partnerId: string;
  mumbiesCashBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SendGiftModal({ lead, partnerId, mumbiesCashBalance, onClose, onSuccess }: SendGiftModalProps) {
  const [amount, setAmount] = useState<number>(10);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendGift = async () => {
    setLoading(true);
    setError(null);

    const result = await sendGiftToLead({
      partnerId,
      leadEmail: lead.email,
      leadName: lead.name,
      amount,
      message: message || undefined
    });

    setLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to send gift');
    }
  };

  const hasInsufficientBalance = mumbiesCashBalance < amount;
  const balanceAfterGift = mumbiesCashBalance - amount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send Gift to Lead</h2>
            <p className="text-sm text-gray-600 mt-1">
              Send a Mumbies gift to encourage their first purchase
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Lead Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sending to
            </label>
            <input
              type="text"
              value={lead.name || lead.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
            {lead.name && (
              <input
                type="text"
                value={lead.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 mt-2"
              />
            )}
          </div>

          {/* Gift Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gift Amount
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAmount(5)}
                className={`px-4 py-3 rounded-lg border-2 font-semibold transition-colors ${
                  amount === 5
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                $5
              </button>
              <button
                onClick={() => setAmount(10)}
                className={`px-4 py-3 rounded-lg border-2 font-semibold transition-colors ${
                  amount === 10
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                $10
              </button>
              <button
                onClick={() => setAmount(25)}
                className={`px-4 py-3 rounded-lg border-2 font-semibold transition-colors ${
                  amount === 25
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                $25
              </button>
            </div>
          </div>

          {/* Balance Check */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Your Mumbies Cash:</span>
              <span className="font-semibold text-gray-900">${mumbiesCashBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Gift amount:</span>
              <span className="text-red-600 font-semibold">-${amount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900">After gift:</span>
                <span className={balanceAfterGift >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${balanceAfterGift.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {hasInsufficientBalance && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 text-sm">Insufficient Mumbies Cash Balance</h4>
                <p className="text-red-700 text-sm mt-1">
                  You need ${(amount - mumbiesCashBalance).toFixed(2)} more in Mumbies Cash to send this gift.
                  Earn commissions by referring customers to unlock this feature.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Optional Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hope this helps you try our natural pet products!"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Security Note */}
          <div className="text-xs text-blue-800 bg-blue-50 border border-blue-200 p-3 rounded-lg flex gap-2">
            <span className="flex-shrink-0">ℹ️</span>
            <span>
              Maximum gift amount is $25 for security. Gift expires in 14 days and returns to your balance if unredeemed.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendGift}
            disabled={hasInsufficientBalance || loading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <GiftIcon className="h-4 w-4" />
                Send ${amount} Gift
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
