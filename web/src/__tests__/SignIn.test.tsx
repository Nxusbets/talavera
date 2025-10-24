import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { SignIn } from '../components/SignIn';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('SignIn Component', () => {
  beforeEach(() => {
    // Reset i18n for each test
    i18n.changeLanguage('en');
  });

  it('should render the sign in form', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SignIn onSubmit={vi.fn()} />
      </I18nextProvider>
    );

    expect(screen.getByText(/sign in/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/email/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/password/i)).toBeTruthy();
  });

  it('should display validation error for invalid email', async () => {
    const user = userEvent.setup();

    render(
      <I18nextProvider i18n={i18n}>
        <SignIn onSubmit={vi.fn()} />
      </I18nextProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      const errorElements = screen.queryAllByRole('alert');
      expect(errorElements.length > 0).toBe(true);
    });
  });

  it('should display error for short password', async () => {
    const user = userEvent.setup();

    render(
      <I18nextProvider i18n={i18n}>
        <SignIn onSubmit={vi.fn()} />
      </I18nextProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'valid@example.com');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      const errorElements = screen.queryAllByRole('alert');
      expect(errorElements.length > 0).toBe(true);
    });
  });

  it('should call onSubmit with valid form data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <I18nextProvider i18n={i18n}>
        <SignIn onSubmit={mockOnSubmit} />
      </I18nextProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'SecurePass123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should handle submission errors gracefully', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'));

    render(
      <I18nextProvider i18n={i18n}>
        <SignIn onSubmit={mockOnSubmit} />
      </I18nextProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'SecurePass123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should display Spanish translations when language is changed', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SignIn onSubmit={vi.fn()} />
      </I18nextProvider>
    );

    await i18n.changeLanguage('es');

    await waitFor(() => {
      expect(screen.getByText(/iniciar sesión/i)).toBeTruthy();
    });
  });
});
