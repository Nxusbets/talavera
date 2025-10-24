import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { SignIn } from '../components/SignIn';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SignIn Component', () => {
  beforeEach(() => {
    // Reset i18n for each test
    i18n.changeLanguage('en');
  });

  it('should render the sign in form', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SignIn />
      </I18nextProvider>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should display validation error for invalid email', async () => {
    const user = userEvent.setup();

    render(
      <I18nextProvider i18n={i18n}>
        <SignIn />
      </I18nextProvider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('should display error for short password', async () => {
    const user = userEvent.setup();

    render(
      <I18nextProvider i18n={i18n}>
        <SignIn />
      </I18nextProvider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(emailInput, 'valid@example.com');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
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

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'SecurePass123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'SecurePass123'
      });
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

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'SecurePass123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error');
    });
  });

  it('should display Spanish translations', async () => {
    const user = userEvent.setup();

    render(
      <I18nextProvider i18n={i18n}>
        <SignIn />
      </I18nextProvider>
    );

    await i18n.changeLanguage('es');

    await waitFor(() => {
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    });
  });
});
