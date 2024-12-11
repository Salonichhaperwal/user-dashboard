import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '../DarkModeToggle';

describe('DarkModeToggle', () => {
  it('toggles between light and dark mode when clicked', () => {
    render(<DarkModeToggle />);
    const toggleButton = screen.getByTestId('dark-mode-toggle');

    expect(toggleButton).toHaveTextContent('☀️');
    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveTextContent('🌙');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveTextContent('🌙');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
