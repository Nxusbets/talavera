import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const SignUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  locale: z.enum(['en', 'es']).optional().default('en')
});

type SignUpFormData = z.infer<typeof SignUpSchema>;

export interface SignUpComponentProps {
  onSubmit?: (data: SignUpFormData) => Promise<void>;
}

export const SignUp: React.FC<SignUpComponentProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    locale: 'en'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);
    setErrors({});

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' });
        return;
      }

      const validatedData = SignUpSchema.parse({
        email: formData.email,
        password: formData.password,
        locale: formData.locale
      });
      
      if (onSubmit) {
        setIsLoading(true);
        await onSubmit(validatedData);
        setSuccessMessage('User registered successfully!');
        setFormData({ email: '', password: '', confirmPassword: '', locale: 'en' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sign-up-form">
      <h2>📝 {t('auth.sign_up') || 'Sign Up'}</h2>

      {generalError && (
        <div className="error-message" role="alert">
          ❌ {generalError}
        </div>
      )}

      {successMessage && (
        <div className="success-message" role="status">
          ✅ {successMessage}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">📧 {t('auth.email') || 'Email'}</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="field-error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">🔐 {t('auth.password') || 'Password'}</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <span id="password-error" className="field-error">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">🔐 Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Repeat your password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
        />
        {errors.confirmPassword && (
          <span id="confirm-error" className="field-error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="locale">🌐 Language</label>
        <select
          id="locale"
          name="locale"
          value={formData.locale}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} className="submit-btn">
        {isLoading ? '⏳ Creating account...' : '✅ Create Account'}
      </button>

      <p className="form-hint">
        ℹ️ <strong>Password requirements:</strong><br/>
        • Minimum 8 characters<br/>
        • At least 1 uppercase letter<br/>
        • At least 1 number
      </p>
    </form>
  );
};
