import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isProcessing?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isProcessing = false,
  variant = 'primary',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    primary: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    success: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700',
    },
    warning: {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    danger: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${styles.bg} flex items-center justify-center`}>
              <AlertCircle className={`w-6 h-6 ${styles.icon}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 text-lg">
            {message}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 px-4 py-2.5 ${styles.button} text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
