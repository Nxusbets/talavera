# 🎨 Guía de la Interfaz de Usuario - Talavera SaaS

## 🚀 Acceso a la Aplicación

**URL:** http://localhost:3000

## 📋 Estructura de la Interfaz

### 1. **Header (Encabezado)**
- Logo: 🚀 Talavera SaaS
- Subtítulo: Plataforma de Suscripciones Localizadas
- Diseño: Gradiente púrpura/azul

### 2. **Tabs (Pestañas)**
- 🔓 **Iniciar Sesión** - Para usuarios existentes
- 📝 **Registrarse** - Para nuevos usuarios

Puedes cambiar entre ambas pestañas haciendo clic en los botones.

### 3. **Footer (Pie de Página)**
- Copyright © 2025 Talavera Solutions

---

## 📝 Opción 1: Registrarse (Sign Up)

### Campos del Formulario

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Email** | Tu correo electrónico | usuario@ejemplo.com |
| **Contraseña** | Contraseña segura | MiPassword123 |
| **Confirmar Contraseña** | Repetir la contraseña | MiPassword123 |
| **Idioma** | Español o English | Español |

### Requisitos de Contraseña ⚠️

Tu contraseña debe cumplir:
- ✅ **Mínimo 8 caracteres**
- ✅ **Al menos 1 letra mayúscula** (A-Z)
- ✅ **Al menos 1 número** (0-9)

**Ejemplos válidos:**
- `MiPassword123`
- `SecurePass456`
- `Login2025`

**Ejemplos inválidos:**
- `password123` ❌ (sin mayúscula)
- `Password` ❌ (sin número)
- `Pass1` ❌ (muy corto - 5 caracteres)

### Proceso de Registro

1. Haz clic en la pestaña **📝 Registrarse**
2. Completa todos los campos
3. Haz clic en **✅ Crear Cuenta**
4. Si todo es correcto:
   - ✅ Verás un mensaje de éxito
   - 🔑 Tu token se guardará automáticamente
   - 📍 Serás redirigido al dashboard

### Errores Comunes

| Error | Solución |
|-------|----------|
| "Email inválido" | Asegúrate de escribir un email válido (ej: correo@empresa.com) |
| "Debe contener al menos una mayúscula" | Añade una letra mayúscula (A-Z) |
| "Debe contener al menos un número" | Añade un número (0-9) |
| "Las contraseñas no coinciden" | Verifica que ambos campos sean iguales |

---

## 🔓 Opción 2: Iniciar Sesión (Sign In)

### Campos del Formulario

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Email** | Tu correo registrado | usuario@ejemplo.com |
| **Contraseña** | Tu contraseña | MiPassword123 |

### Proceso de Inicio de Sesión

1. Haz clic en la pestaña **🔓 Iniciar Sesión** (por defecto)
2. Ingresa tu email y contraseña
3. Haz clic en **Iniciar Sesión**
4. Si todo es correcto:
   - ✅ Verás un mensaje de bienvenida
   - 🔑 Tu token se guardará automáticamente
   - 📍 Serás redirigido al dashboard

### Usuario de Prueba

Ya tienes un usuario listo:

```
Email:    demo@talavera.dev
Password: Demo12345
```

---

## 🎨 Diseño y Experiencia

### Colores
- **Gradiente Principal:** Púrpura (#667eea) → Violeta (#764ba2)
- **Acentos:** Azul cielo
- **Errores:** Rojo (#e74c3c)
- **Éxito:** Verde (#27ae60)

### Animaciones
- ⬇️ **Slide Down:** Header aparece desde arriba
- ⬆️ **Slide Up:** Contenedor aparece desde abajo
- ➡️ **Slide In:** Errores aparecen con movimiento
- 👁️ **Fade In:** Transiciones suaves entre formularios

### Responsiva
- ✅ Funciona en computadoras
- ✅ Funciona en tablets
- ✅ Funciona en dispositivos móviles

---

## 🔐 Almacenamiento de Datos

### Local Storage
Después de registrarte o iniciar sesión, se guardan:

```javascript
localStorage.getItem('authToken')    // Tu token JWT
localStorage.getItem('userEmail')    // Tu email
```

### Validez del Token
- ⏰ **Duración:** 24 horas
- 🔄 **Después de 24h:** Necesitas iniciar sesión nuevamente

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
