/**
 * Unit tests for AuthInput Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthInput from '@/src/components/AuthInput';
import { Mail } from 'lucide-react';

describe('AuthInput Component', () => {
  it('should render with label', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="test-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email Address"
      />
    );
    
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('should render input with correct type', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="test-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email"
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should display value', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="test-input"
        type="email"
        value="test@example.com"
        onChange={handleChange}
        label="Email"
      />
    );
    
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.value).toBe('test@example.com');
  });

  it('should call onChange when input changes', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="test-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email"
      />
    );
    
    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should render with placeholder', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="test-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email"
        placeholder="Enter your email"
      />
    );
    
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
  });

  it('should be required when required prop is true', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="test-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email"
        required
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toBeRequired();
  });

  it('should be disabled when disabled prop is true', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="test-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email"
        disabled
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toBeDisabled();
  });

  it('should render with icon when provided', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <AuthInput
        id="test-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email"
        icon={Mail}
      />
    );
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have correct id attribute', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="email-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email"
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('should support text type', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="name-input"
        type="text"
        value=""
        onChange={handleChange}
        label="Name"
      />
    );
    
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should support password type', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="password-input"
        type="password"
        value=""
        onChange={handleChange}
        label="Password"
      />
    );
    
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should apply correct CSS classes', () => {
    const handleChange = jest.fn();
    render(
      <AuthInput
        id="test-input"
        type="email"
        value=""
        onChange={handleChange}
        label="Email"
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('rounded-xl');
  });
});
