/**
 * Unit tests for TertiaryButton Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TertiaryButton from '@/src/components/TertiaryButton';

describe('TertiaryButton Component', () => {
  it('should render with children text', () => {
    const handleClick = jest.fn();
    render(<TertiaryButton onClick={handleClick}>Click Me</TertiaryButton>);
    
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<TertiaryButton onClick={handleClick}>Click Me</TertiaryButton>);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<TertiaryButton onClick={handleClick} disabled>Click Me</TertiaryButton>);
    
    const button = screen.getByText('Click Me');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<TertiaryButton onClick={handleClick} disabled>Click Me</TertiaryButton>);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not be disabled by default', () => {
    const handleClick = jest.fn();
    render(<TertiaryButton onClick={handleClick}>Click Me</TertiaryButton>);
    
    const button = screen.getByText('Click Me');
    expect(button).not.toBeDisabled();
  });

  it('should apply correct CSS classes', () => {
    const handleClick = jest.fn();
    render(<TertiaryButton onClick={handleClick}>Click Me</TertiaryButton>);
    
    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('text-green-600');
    expect(button).toHaveClass('hover:text-green-700');
  });

  it('should render as a button element', () => {
    const handleClick = jest.fn();
    render(<TertiaryButton onClick={handleClick}>Click Me</TertiaryButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should support complex children content', () => {
    const handleClick = jest.fn();
    render(
      <TertiaryButton onClick={handleClick}>
        <span>Back to</span> <strong>Login</strong>
      </TertiaryButton>
    );
    
    expect(screen.getByText('Back to')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
