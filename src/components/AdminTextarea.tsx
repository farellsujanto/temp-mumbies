import React from 'react';

interface AdminTextareaProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export default function AdminTextarea({
  id,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  rows = 3,
  className = '',
}: AdminTextareaProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-600 placeholder:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
