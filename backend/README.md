# E-Commerce Chat Assistant Backend

A complete AI-powered e-commerce backend with Gemini AI chat assistant and Jumia Ghana product integration.

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Gemini AI Integration](#-gemini-ai-integration)
- [Jumia Scraping](#-jumia-scraping)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

---

## ✅ Features

- 🤖 **Gemini AI Chat** - Intelligent shopping assistant with natural language understanding
- 🛍️ **Jumia Integration** - Real-time product scraping from Jumia Ghana
- 🔐 **Authentication** - JWT-based auth with password reset functionality
- 🛒 **Shopping Cart** - Complete cart management system
- ❤️ **Wishlist** - Save and manage favorite products
- 💬 **Conversation History** - Session-based chat tracking with context awareness
- 🔒 **Token Blacklist** - Secure logout with token invalidation
- 👨‍💼 **Admin Panel** - User management and system statistics
- 🔍 **Smart Search** - AI-powered product discovery
- 📦 **Product Caching** - MongoDB caching for scraped products

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Setup](#-environment-setup) below)

### 3. Start Server
```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

### 4. Verify Installation
Server should start on `http://localhost:5000`

Test the server:
```bash
curl http://localhost:5000/
```

Expected response: `{"message":"Welcome to E-Commerce Chat Assistant API"}`

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Local MongoDB)
MONGO_URI=mongodb://localhost:27017/ecommerce-chat-assistant

# Database (MongoDB Atlas - recommended for production)
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Google Gemini AI (REQUIRED!)
GEMINI_API_KEY=your-gemini-api-key-here

# Email (Optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Jumia Scraping Configuration
JUMIA_BASE_URL=https://www.jumia.com.gh
SCRAPER_THROTTLE_MS=2000
```

### Getting Your Gemini API Key

1. Visit: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

**Note:** The free tier includes:
- 60 requests per minute
- 1,500 requests per day
- Sufficient for development and testing

### Important Notes

- **JWT_SECRET**: Use a long, random string in production
- **MONGO_URI**: MongoDB Atlas is recommended for production
- **EMAIL_PASSWORD**: Use app-specific passwords for Gmail (not your account password)

---

## 🔧 Tech Stack

### Core Technologies
- **Runtime:** Node.js (v18+ recommended) with ES Modules
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB with Mongoose 8.0.3
- **AI Engine:** Google Gemini AI (@google/generative-ai 0.24.1)
- **Web Scraping:** Axios + Cheerio
- **Authentication:** JWT (jsonwebtoken + bcryptjs)

### Key Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "@google/generative-ai": "^0.24.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "axios": "^1.6.2",
  "cheerio": "^1.0.0",
  "dotenv": "^16.3.1",
  "express-async-handler": "^1.2.0",
  "nodemailer": "^6.9.7"
}
```

---

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection setup
│
├── controllers/
│   ├── adminController.js       # Admin operations (user mgmt, stats)
│   ├── authController.js        # Registration, login, password reset
│   ├── cartController.js        # Shopping cart CRUD
│   ├── chatController.js        # Gemini AI chat + product discovery
│   ├── productController.js     # Product operations + Jumia integration
│   ├── userController.js        # User profile management
│   └── wishlistController.js    # Wishlist CRUD
│
├── models/
│   ├── Cart.js                  # Shopping cart schema
│   ├── Conversation.js          # Chat history with sessionId
│   ├── Product.js               # Cached marketplace products
│   ├── TokenBlacklist.js        # Invalidated JWT tokens
│   ├── User.js                  # User accounts
│   └── Wishlist.js              # User wishlists
│
├── routes/
│   ├── adminRoutes.js           # /api/admin/*
│   ├── authRoutes.js            # /api/auth/*
│   ├── cartRoutes.js            # /api/cart/*
│   ├── chatRoutes.js            # /api/chat/*
│   ├── productRoutes.js         # /api/products/*
│   ├── userRoutes.js            # /api/users/*
│   └── wishlistRoutes.js        # /api/wishlist/*
│
├── middleware/
│   ├── admin.js                 # Admin role authorization
│   ├── auth.js                  # JWT authentication
│   └── errorHandler.js          # Global error handler
│
├── services/
│   ├── aiService.js             # Gemini AI integration ✨
│   └── jumiaService.js          # Jumia Ghana scraping ✨
│
├── utils/                       # Helper functions
│
├── .env.example                 # Environment template
├── app.js                       # Express app configuration
├── server.js                    # Server entry point
└── package.json                 # Dependencies
```

---

## 🗄️ Database Schema

### Collections Overview

Your MongoDB database should have **6 collections**:

1. **users** - User accounts and authentication
2. **tokenblacklists** - Invalidated JWT tokens (for logout)
3. **products** - Cached products from marketplaces
4. **conversations** - Chat history with Gemini AI
5. **carts** - User shopping carts
6. **wishlists** - User wishlists

### 1. Users Collection

**Model:** `models/User.js`

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  role: String (enum: 'user', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`: unique index for fast lookup

### 2. Token Blacklist Collection

**Model:** `models/TokenBlacklist.js`

```javascript
{
  _id: ObjectId,
  token: String (unique, indexed),
  userId: ObjectId (indexed),
  expiresAt: Date (TTL index - auto-delete after expiry),
  createdAt: Date
}
```

**Purpose:** Invalidate JWT tokens on logout for security

### 3. Products Collection

**Model:** `models/Product.js`

```javascript
{
  _id: ObjectId,
  marketplace: String (e.g., 'jumia'),
  productId: String,
  title: String,
  price: Number,
  currency: String (default: 'GHS'),
  image: String (URL),
  productUrl: String,
  rating: Number,
  reviewsCount: Number,
  inStock: Boolean,
  scrapedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Unique Index:** `{marketplace, productId}` - prevents duplicate products

### 4. Conversations Collection

**Model:** `models/Conversation.js`

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', indexed),
  sessionId: String (indexed),
  messages: [
    {
      role: String ('user' | 'assistant'),
      content: String,
      timestamp: Date,
      action: String ('search_products' | 'ask_question'),
      query: String,
      recommendations: [
        {
          marketplace: String,
          productId: String,
          title: String,
          price: Number,
          currency: String,
          image: String,
          productUrl: String,
          rating: Number,
          reviewsCount: Number,
          quickActions: [String]
        }
      ]
    }
  ],
  context: {
    userPreferences: Mixed,
    searchIntent: String,
    marketplace: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Purpose:** Track chat history and maintain conversation context

### 5. Carts Collection

**Model:** `models/Cart.js`

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', unique indexed),
  items: [
    {
      productId: ObjectId (ref: 'Product'),
      marketplace: String,
      quantity: Number (default: 1, min: 1),
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Wishlists Collection

**Model:** `models/Wishlist.js`

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', unique indexed),
  items: [
    {
      productId: ObjectId (ref: 'Product'),
      marketplace: String,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🤖 Gemini AI Integration

### Overview

The chat system uses **Google Gemini AI (gemini-2.0-flash)** to provide intelligent shopping assistance.

### How It Works

1. **User sends message** → `POST /api/chat`
2. **AI analyzes intent** → Returns structured JSON
3. **System takes action**:
   - `action: "ask_question"` → AI asks for clarification
   - `action: "search_products"` → Triggers Jumia scraping
4. **Response sent to user** → Chat message + product recommendations

### AI Response Structure

```javascript
{
  action: "search_products" | "ask_question",
  query: "search term for jumia",  // Only if action is search_products
  reply: "AI message to user"
}
```

### System Prompt

The AI is instructed to:
- Ask clarifying questions for vague requests
- Extract search queries from user messages
- Focus on Ghanaian market (prices in GHS)
- Trigger searches only when intent is clear

### Configuration

**File:** `services/aiService.js`

```javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash', // Current working model
  systemInstruction: SYSTEM_INSTRUCTION,
});
```

**Available Models:**
- `gemini-2.0-flash` (current, fastest)
- `gemini-2.5-flash` (more capable)
- `gemini-2.5-pro` (most advanced)

**Note:** Older models (`gemini-pro`, `gemini-1.5-flash`) are deprecated and no longer work.

### Fallback Logic

If Gemini AI fails, the system:
1. Logs the error
2. Returns a fallback response
3. Suggests the user rephrase their message

---

## 🛍️ Jumia Scraping

### Overview

The system scrapes product data from **Jumia Ghana** in real-time using Axios and Cheerio.

### Features

- ✅ Real-time product scraping
- ✅ Auto-caching to MongoDB
- ✅ Request throttling (2 seconds between requests)
- ✅ Exponential backoff retry logic
- ✅ Error handling and logging

### How It Works

1. **AI triggers search** → `jumiaService.searchProducts(query)`
2. **HTTP request** → Fetches Jumia search page
3. **HTML parsing** → Extracts product data with Cheerio
4. **Data extraction**:
   - Product ID from URL
   - Title, price, currency
   - Image URL (300x300)
   - Rating and reviews
   - Product URL
5. **Caching** → Saves to MongoDB `products` collection
6. **Return results** → Array of products

### Configuration

**File:** `services/jumiaService.js`

```javascript
const BASE_URL = 'https://www.jumia.com.gh';
const THROTTLE_MS = 2000; // 2 seconds between requests
```

### Extracted Data

```javascript
{
  marketplace: 'jumia',
  productId: '300587397',
  title: 'DELL PROMAX 16 - Black',
  price: 25000,
  currency: 'GHS',
  image: 'https://gh.jumia.is/unsafe/fit-in/300x300/.../1.jpg',
  productUrl: 'https://www.jumia.com.gh/dell-promax-16-...',
  rating: 4.5,
  reviewsCount: 120,
  inStock: true,
  scrapedAt: Date
}
```

### Rate Limiting

- **Throttle:** 2 seconds between requests
- **Retry Logic:** Exponential backoff (1s, 2s, 4s)
- **Max Retries:** 3 attempts

### Error Handling

- Network errors → Retry with backoff
- Parse errors → Log and skip product
- Rate limiting → Automatic throttling

---

## 📚 API Documentation

For complete API documentation, see **[API_ENDPOINTS.md](./API_ENDPOINTS.md)**

### Quick Reference

**Base URL:** `http://localhost:5000`

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/logout` - Logout (invalidate token)

#### Chat (Gemini AI)
- `POST /api/chat` - Send message to AI
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/conversations/:sessionId` - Get specific conversation

#### Products
- `GET /api/products/jumia/search?q=laptop` - Search Jumia products
- `GET /api/products/:marketplace/:productId` - Get product details

#### Cart & Wishlist
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist

#### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - Dashboard statistics

---

## 🧪 Testing

### Manual Testing

#### 1. Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 2. Test Chat (Save the token from login)
```bash
export TOKEN="your-jwt-token-here"

curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "I need a Dell laptop under 5000 GHS"}'
```

#### 3. Test Product Search
```bash
curl -X GET "http://localhost:5000/api/products/jumia/search?q=laptop" \
  -H "Authorization: Bearer $TOKEN"
```

### Testing Chat Feature

The chat system supports two types of responses:

**1. Clarifying Questions (vague input)**
```bash
# Input: "laptop"
# Response: AI asks "What's your budget?"
```

**2. Product Search (clear input)**
```bash
# Input: "Dell laptop under 5000 GHS"
# Response: AI searches and returns products
```

### Expected Behavior

- ✅ **Vague queries** → AI asks for more details
- ✅ **Specific queries** → AI triggers product search
- ✅ **All products** → Include image URLs (100% coverage)
- ✅ **Response time** → 3-8 seconds typical
- ✅ **Session tracking** → Conversations persist across messages

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Gemini API 404 Error
```
[GoogleGenerativeAI Error]: models/gemini-pro is not found
```

**Solution:** Update `services/aiService.js` to use `gemini-2.0-flash`:
```javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash', // ✅ Use this
});
```

#### 2. MongoDB Connection Error
```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solutions:**
- Check if MongoDB is running: `sudo systemctl status mongodb`
- Verify `MONGO_URI` in `.env`
- For MongoDB Atlas: Check network access and credentials

#### 3. JWT Authentication Error
```
JsonWebTokenError: invalid signature
```

**Solutions:**
- Clear browser storage/cookies
- Login again to get a fresh token
- Verify `JWT_SECRET` in `.env` hasn't changed

#### 4. Jumia Scraping Timeout
```
Error: Timeout waiting for Jumia response
```

**Solutions:**
- Check internet connection
- Verify `JUMIA_BASE_URL` in `.env`
- Jumia may be rate-limiting - wait and retry

#### 5. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5001
```

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
```

This will show:
- Detailed error messages
- AI request/response logs
- Scraping logs
- Database queries

### Getting Help

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test each endpoint individually to isolate issues
4. Review the API_ENDPOINTS.md for correct request formats

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👤 Author

**E-Commerce Chat Assistant Team**

For questions or support, please open an issue on GitHub.

---

## 🎉 Status

**Current Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** December 1, 2025

**System Health:**
- ✅ Authentication: Working
- ✅ Gemini AI: Fully functional (gemini-2.0-flash)
- ✅ Jumia Scraping: Operational
- ✅ Product Images: 100% coverage
- ✅ Database: Connected
- ✅ All APIs: Tested and verified

**Ready for deployment!** 🚀

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
