/**
 * Unit tests for PrimaryButton Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrimaryButton from '@/src/components/PrimaryButton';
import { Mail } from 'lucide-react';

describe('PrimaryButton Component', () => {
  it('should render with children text', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Click Me</PrimaryButton>);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<PrimaryButton disabled>Click Me</PrimaryButton>);
    
    const button = screen.getByText('Click Me');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick} disabled>Click Me</PrimaryButton>);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading state when loading is true', () => {
    render(<PrimaryButton loading>Click Me</PrimaryButton>);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
  });

  it('should show custom loading text', () => {
    render(<PrimaryButton loading loadingText="Processing...">Click Me</PrimaryButton>);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    render(<PrimaryButton loading>Click Me</PrimaryButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render with icon when provided', () => {
    render(<PrimaryButton icon={Mail}>Send Email</PrimaryButton>);
    
    const button = screen.getByText('Send Email');
    expect(button).toBeInTheDocument();
    // Icon is rendered as SVG element
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should have submit type when type is submit', () => {
    render(<PrimaryButton type="submit">Submit</PrimaryButton>);
    
    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should have button type by default', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    
    const button = screen.getByText('Click Me');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should apply correct CSS classes', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    
    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('bg-gradient-to-r');
    expect(button).toHaveClass('from-green-500');
  });

  it('should show loading spinner when loading', () => {
    const { container } = render(<PrimaryButton loading>Click Me</PrimaryButton>);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
