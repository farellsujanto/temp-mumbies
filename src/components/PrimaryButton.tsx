import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  loadingText?: string;
}

export default function PrimaryButton({
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  children,
  icon: Icon,
  loadingText = 'Loading...',
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 text-lg"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
}
