import React from 'react';

interface AdminInputProps {
  id?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'url';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  step?: string;
  min?: string;
  max?: string;
}

export default function AdminInput({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  className = '',
  step,
  min,
  max,
}: AdminInputProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-600 placeholder:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
