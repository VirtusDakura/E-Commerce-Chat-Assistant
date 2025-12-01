# E-Commerce Chat Assistant Backend

A complete AI-powered e-commerce backend with Gemini AI chat assistant and Jumia Ghana product integration.

## ✅ Features

- 🤖 **Gemini AI Chat** - Intelligent shopping assistant
- 🛍️ **Jumia Integration** - Real-time product scraping from Jumia Ghana
- 🔐 **Authentication** - JWT-based auth with password reset
- 🛒 **Shopping Cart** - Full cart management
- ❤️ **Wishlist** - Save favorite products
- 💬 **Conversation History** - Session-based chat tracking
- 🔒 **Token Blacklist** - Secure logout functionality
- 👨‍💼 **Admin Panel** - User management and statistics

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

**Required environment variables:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ecommerce-chat-assistant

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Gemini AI (Required!)
GEMINI_API_KEY=your-gemini-api-key-here

# Email (Optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Jumia Scraping
JUMIA_BASE_URL=https://www.jumia.com.gh
SCRAPER_THROTTLE_MS=2000
```

**Get your Gemini API key:** https://makersuite.google.com/app/apikey

### 3. Start Server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

### 4. Verify
Server should start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/           # Configuration
├── controllers/      # Request handlers
├── middleware/       # Auth & validation
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # AI & scraping
├── utils/           # Helpers
├── scripts/         # Utility scripts
├── app.js          # Express app
└── server.js       # Entry point
```

## 🔧 Tech Stack

- **Runtime:** Node.js with ES Modules
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB with Mongoose 8.0.3
- **AI:** Google Gemini AI (@google/generative-ai 0.24.1)
- **Scraping:** Axios + Cheerio
- **Auth:** JWT (jsonwebtoken + bcryptjs)

## 📚 Documentation

- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Complete API reference
- **[DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md)** - Database schemas
- **[STRUCTURE.md](./STRUCTURE.md)** - Architecture details
- **[GEMINI_JUMIA_SETUP.md](./GEMINI_JUMIA_SETUP.md)** - AI & scraping setup

## 🧪 Quick Test

**1. Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123456"}'
```

**2. Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

**3. Chat with AI**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"gaming laptop under 5000 GHS"}'
```

## 🎯 API Overview

| Route Group | Base Path | Description |
|------------|-----------|-------------|
| Auth | `/api/auth` | Register, login, logout, password reset |
| Users | `/api/users` | User profile management |
| Chat | `/api/chat` | AI chat & conversation history |
| Products | `/api/products` | Product search & Jumia integration |
| Cart | `/api/cart` | Shopping cart operations |
| Wishlist | `/api/wishlist` | Wishlist management |
| Admin | `/api/admin` | Admin operations (protected) |

## �� Development

```bash
# Run with auto-reload
npm run dev

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Clean database
node scripts/cleanupDatabase.js
```

## 🔒 Security Features

- ✅ JWT authentication with token blacklist
- ✅ Password hashing with bcryptjs
- ✅ Secure logout (token invalidation)
- ✅ Role-based access control
- ✅ Input validation

## 🚨 Important Notes

### Jumia Scraping
The scraping service is for educational purposes. Before production:
1. Review Jumia's Terms of Service
2. Consider official Jumia Affiliate API
3. Respect rate limits (2s between requests)

### Environment Variables
Never commit `.env` file. Always use `.env.example` as template.

---

**Status:** ✅ Production Ready
