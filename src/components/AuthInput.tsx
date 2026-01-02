import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthInputProps {
  id: string;
  type: 'email' | 'text' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
}

export default function AuthInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  required = false,
  disabled = false,
}: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 text-gray-900 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none placeholder:text-gray-500 caret-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900" />
        )}
      </div>
    </div>
  );
}
