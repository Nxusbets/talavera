# 🎨 User Interface Guide - Talavera SaaS

## 🚀 Application Access

**URL:** http://localhost:3000

## 📋 Interface Structure

### 1. **Header**
- Logo: 🚀 Talavera SaaS
- Subtitle: Localized Subscriptions Platform
- Design: Purple/Blue Gradient

### 2. **Tabs**
- 🔓 **Sign In** - For existing users
- 📝 **Sign Up** - For new users

You can switch between both tabs by clicking the buttons.

### 3. **Footer**
- Copyright © 2025 Talavera Solutions

---

## 📝 Option 1: Sign Up

### Form Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Email** | Your email address | user@example.com |
| **Password** | Secure password | MyPassword123 |
| **Confirm Password** | Repeat password | MyPassword123 |
| **Language** | Spanish or English | English |

### Password Requirements ⚠️

Your password must meet:
- ✅ **Minimum 8 characters**
- ✅ **At least 1 uppercase letter** (A-Z)
- ✅ **At least 1 number** (0-9)

**Valid examples:**
- `MyPassword123`
- `SecurePass456`
- `Login2025`

**Invalid examples:**
- `password123` ❌ (no uppercase)
- `Password` ❌ (no number)
- `Pass1` ❌ (too short - 5 characters)

### Registration Process

1. Click on **📝 Sign Up** tab
2. Fill in all fields
3. Click **✅ Create Account**
4. If successful:
   - ✅ You'll see a success message
   - 🔑 Your token will be saved automatically
   - 📍 You'll be redirected to the dashboard

### Common Errors

| Error | Solution |
|-------|----------|
| "Invalid email" | Make sure to enter a valid email (e.g: email@company.com) |
| "Must contain at least one uppercase letter" | Add an uppercase letter (A-Z) |
| "Must contain at least one number" | Add a number (0-9) |
| "Passwords do not match" | Check that both fields are identical |

---

## 🔓 Option 2: Sign In

### Form Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Email** | Your registered email | user@example.com |
| **Password** | Your password | MyPassword123 |

### Sign In Process

1. Click on **🔓 Sign In** tab (default)
2. Enter your email and password
3. Click **Sign In**
4. If successful:
   - ✅ You'll see a welcome message
   - 🔑 Your token will be saved automatically
   - 📍 You'll be redirected to the dashboard

### Test User

You already have a test user ready:

```
Email:    demo@talavera.dev
Password: Demo12345
```

---

## 🎨 Design and Experience

### Colors
- **Main Gradient:** Purple (#667eea) → Violet (#764ba2)
- **Accents:** Sky Blue
- **Errors:** Red (#e74c3c)
- **Success:** Green (#27ae60)

### Animations
- ⬇️ **Slide Down:** Header appears from top
- ⬆️ **Slide Up:** Container appears from bottom
- ➡️ **Slide In:** Errors appear with movement
- 👁️ **Fade In:** Smooth transitions between forms

### Responsive
- ✅ Works on computers
- ✅ Works on tablets
- ✅ Works on mobile devices

---

## 🔐 Data Storage

### Local Storage
After signing up or signing in, the following are saved:

```javascript
localStorage.getItem('authToken')    // Your JWT token
localStorage.getItem('userEmail')    // Your email
```

### Token Validity
- ⏰ **Duration:** 24 hours
- 🔄 **After 24h:** You need to sign in again

---

## 🌐 Integración con API

### Endpoint de Registro
```
POST /api/auth/signup
```

Datos enviados:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123",
  "locale": "es"
}
```

### Endpoint de Login
```
POST /api/auth/signin
```

Datos enviados:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123"
}
```

---

## 💡 Consejos de Uso

1. **Guarda tu contraseña** en un lugar seguro
2. **No compartas tu email** de registro con otros usuarios
3. **Usa contraseñas fuertes** con mayúsculas, números y caracteres especiales
4. **Cierra sesión** en dispositivos públicos
5. **Si olvidas tu contraseña**, crea una nueva cuenta con otro email

---

## 🆘 Resolución de Problemas

### ¿No puedo registrarme?
- Verifica que el email sea único (no esté ya registrado)
- Comprueba que la contraseña cumple los requisitos
- Asegúrate que la API esté disponible (http://localhost:3001)

### ¿Mi token no se guarda?
- Abre la consola del navegador (F12)
- Verifica que LocalStorage esté habilitado
- Comprueba que no haya errores en la consola

### ¿Se cerró mi sesión?
- Los tokens expiran después de 24 horas
- Inicia sesión nuevamente con tus credenciales
- Tu token se renovará automáticamente

### ¿El frontend no carga?
- Verifica que Docker esté corriendo
- Revisa que el contenedor `talavera-web` esté activo
- Recarga la página (Ctrl+R o Cmd+R)

---

## 📚 Próximos Pasos

Después de autenticarte:
1. 🏠 Accederás al dashboard
2. 📁 Podrás crear proyectos
3. 💳 Verás planes de suscripción
4. 🔐 Gestionarás tu perfil

---

## 📞 Soporte Técnico

- **API Health:** http://localhost:3001/health
- **Frontend:** http://localhost:3000
- **API Base:** http://localhost:3001
- **Base de Datos:** localhost:5432

---

¡Listo para explorar Talavera SaaS! 🚀
