# 🚀 Guía Rápida de Autenticación - Talavera SaaS

## 👤 Usuario de Prueba Listo

```
Email:    demo@talavera.dev
Password: Demo12345
Token:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGVtb0B0YWxhdmVyYS5kZXYiLCJpYXQiOjE3NjEzMzg2NDQsImV4cCI6MTc2MTQyNTA0NH0.0XmeXYzdmTNyDHXa0JtRWNXDWhyBFDtPNEV0KpI2Lb0
```

## 🔐 Cómo Autenticarse

### Opción 1: Crear Tu Propio Usuario (Signup)

**POST** `http://localhost:3001/api/auth/signup`

```json
{
  "email": "tuusuario@ejemplo.com",
  "password": "MiPassword123",
  "locale": "es"
}
```

**Respuesta:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "email": "tuusuario@ejemplo.com"
  }
}
```

### Opción 2: Iniciar Sesión (Signin)

**POST** `http://localhost:3001/api/auth/signin`

```json
{
  "email": "demo@talavera.dev",
  "password": "Demo12345"
}
```

## 🔑 Requisitos de Contraseña

- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 letra mayúscula (A-Z)
- ✅ Al menos 1 número (0-9)

**Ejemplos válidos:**
- `MiPassword123`
- `SecurePass456`
- `Demo12345`

**Ejemplos inválidos:**
- `password123` (sin mayúscula)
- `Password` (sin número)
- `Pass1` (muy corto)

## 📡 Usar el Token

Una vez que tengas el token, úsalo en el header de todas las requests autenticadas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejemplo con cURL:

```bash
curl -H "Authorization: Bearer TOKEN_AQUI" \
  http://localhost:3001/api/projects
```

### Ejemplo con PowerShell:

```powershell
$headers = @{
  "Authorization" = "Bearer TOKEN_AQUI"
  "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:3001/api/projects" `
  -Headers $headers `
  -Method Get
```

## 🎯 Endpoints Disponibles

### Autenticación
- `POST /api/auth/signup` - Crear nuevo usuario
- `POST /api/auth/signin` - Iniciar sesión
- `GET /health` - Verificar API (sin autenticación)

### Proyectos (requiere autenticación)
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener proyecto

### Planes y Suscripciones
- `GET /api/plans` - Ver planes disponibles
- `POST /api/subscriptions` - Crear suscripción
- `GET /api/subscriptions/:id` - Ver suscripción
- `GET /api/invoices/:id` - Ver factura

## 💡 Ejemplo Completo

### 1. Registrarse

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "miusuario@empresa.com",
    "password": "MiPassword123",
    "locale": "es"
  }'
```

### 2. Copiar el Token Recibido

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "email": "miusuario@empresa.com"
  }
}
```

### 3. Usar el Token en Próximas Requests

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Mi Proyecto",
    "description": "Descripción del proyecto"
  }'
```

## ⏰ Validez del Token

- **Duración:** 24 horas
- **Después de 24h:** Necesitas iniciar sesión nuevamente

## 🎮 Herramientas Recomendadas

- **Postman:** https://www.postman.com (GUI amigable)
- **Insomnia:** https://insomnia.rest (alternativa a Postman)
- **cURL:** Línea de comandos (preinstalado)
- **Thunder Client:** Extensión de VS Code

## 📍 Endpoints de Acceso

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **Base de Datos:** localhost:5432
- **Health Check:** http://localhost:3001/health

---

¡Listo para comenzar! 🚀
