# 🚀 Quick Authentication Guide - Talavera SaaS

## 👤 Test User Ready to Use

```
Email:    demo@talavera.dev
Password: Demo12345
Token:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiZGVtb0B0YWxhdmVyYS5kZXYiLCJpYXQiOjE3NjEzMzg2NDQsImV4cCI6MTc2MTQyNTA0NH0.0XmeXYzdmTNyDHXa0JtRWNXDWhyBFDtPNEV0KpI2Lb0
```

## 🔐 How to Authenticate

### Option 1: Create Your Own User (Signup)

**POST** `http://localhost:3001/api/auth/signup`

```json
{
  "email": "youruser@example.com",
  "password": "SecurePass123",
  "locale": "en"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "email": "youruser@example.com"
  }
}
```

### Option 2: Sign In (Login)

**POST** `http://localhost:3001/api/auth/signin`

```json
{
  "email": "demo@talavera.dev",
  "password": "Demo12345"
}
```

## 🔑 Password Requirements

- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 number (0-9)

**Ejemplos válidos:**
- `MiPassword123`
- `SecurePass456`
- `Demo12345`

**Ejemplos inválidos:**
- `password123` (no uppercase)
- `Password` (no number)
- `Pass1` (too short)

## 📡 Using the Token

Once you have the token, use it in the header of all authenticated requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example with cURL:

```bash
curl -H "Authorization: Bearer TOKEN_HERE" \
  http://localhost:3001/api/projects
```

### Example with PowerShell:

```powershell
$headers = @{
  "Authorization" = "Bearer TOKEN_HERE"
  "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:3001/api/projects" `
  -Headers $headers `
  -Method Get
```

## 🎯 Available Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in user
- `GET /health` - Check API (no authentication needed)

### Projects (requires authentication)
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project

### Plans and Subscriptions
- `GET /api/plans` - View available plans
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/:id` - View subscription
- `GET /api/invoices/:id` - View invoice

## 💡 Complete Example

### 1. Sign Up

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "MyPassword123",
    "locale": "en"
  }'
```

### 2. Copy the Received Token

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "email": "newuser@example.com"
  }
}
```

### 3. Use the Token in Next Requests

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "My First Project",
    "description": "Project description"
  }'
```

## ⏰ Token Validity

- **Duration:** 24 hours
- **After 24h:** You need to sign in again

## 🎮 Recommended Tools

- **Postman:** https://www.postman.com (GUI friendly)
- **Insomnia:** https://insomnia.rest (alternative to Postman)
- **cURL:** Command line (pre-installed)
- **Thunder Client:** VS Code Extension

## 📍 Access Points

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **Database:** localhost:5432
- **Health Check:** http://localhost:3001/health

---

Ready to begin! 🚀
