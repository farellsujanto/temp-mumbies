import React from 'react';

interface TertiaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function TertiaryButton({
  onClick,
  disabled = false,
  children,
}: TertiaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
