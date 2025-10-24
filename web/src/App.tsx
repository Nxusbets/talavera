import React, { useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Dashboard } from './components/Dashboard';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signin`, data);
      const { token, email } = response.data.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      setUserEmail(email);
      setMessage({ type: 'success', text: `¡Bienvenido ${email}!` });
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error al iniciar sesión';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleSignUp = async (data: { email: string; password: string; locale: string }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, data);
      const { token, email } = response.data.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      setUserEmail(email);
      setMessage({ type: 'success', text: `¡Cuenta creada exitosamente! Bienvenido ${email}` });
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error al registrarse';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
    setMessage({ type: 'success', text: '¡Sesión cerrada correctamente!' });
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>🚀 Talavera SaaS</h1>
            <p>Plataforma de Suscripciones Localizadas</p>
          </div>
        </header>

        <main className="app-main">
          {isAuthenticated ? (
            <Dashboard email={userEmail} onLogout={handleLogout} />
          ) : (
            <div className="auth-container">
              {/* Tabs */}
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signin')}
                >
                  🔓 Iniciar Sesión
                </button>
                <button
                  className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signup')}
                >
                  📝 Registrarse
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`message message-${message.type}`}>
                  {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
              )}

              {/* Forms */}
              <div className="forms-container">
                {activeTab === 'signin' && (
                  <SignIn onSubmit={handleSignIn} />
                )}
                {activeTab === 'signup' && (
                  <SignUp onSubmit={handleSignUp} />
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>© 2025 Talavera Solutions. Todos los derechos reservados.</p>
        </footer>
      </div>
    </I18nextProvider>
  );
};

export default App;
