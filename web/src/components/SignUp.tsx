import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const SignUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  locale: z.enum(['en', 'es']).optional().default('es')
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
    locale: 'es'
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
        setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
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
        setSuccessMessage('¡Usuario registrado exitosamente!');
        setFormData({ email: '', password: '', confirmPassword: '', locale: 'es' });
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
      <h2>📝 {t('auth.sign_up') || 'Crear Cuenta'}</h2>

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
          placeholder="correo@ejemplo.com"
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
        <label htmlFor="password">🔐 {t('auth.password') || 'Contraseña'}</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Mín 8 caracteres, 1 mayúscula, 1 número"
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
        <label htmlFor="confirmPassword">🔐 Confirmar Contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Repite tu contraseña"
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
        <label htmlFor="locale">🌐 Idioma</label>
        <select
          id="locale"
          name="locale"
          value={formData.locale}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} className="submit-btn">
        {isLoading ? '⏳ Registrando...' : '✅ Crear Cuenta'}
      </button>

      <p className="form-hint">
        ℹ️ <strong>Requisitos de contraseña:</strong><br/>
        • Mínimo 8 caracteres<br/>
        • Al menos 1 letra mayúscula<br/>
        • Al menos 1 número
      </p>
    </form>
  );
};
