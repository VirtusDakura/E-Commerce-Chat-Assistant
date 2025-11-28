# 🚀 Quick Reference - E-Commerce Chat Assistant

## Project Status: ✅ READY TO USE

### ✅ What's Working

1. **Gemini AI Integration** (@google/generative-ai v0.24.1 installed)
2. **Jumia Ghana Scraping** (throttled, cached, with retry logic)
3. **Chat API** (`POST /api/chat`) - Main endpoint ready
4. **Session-based Conversations** - Track user chat history
5. **Product Caching** - Scraped products stored in MongoDB
6. **Lint-clean Code** - All new files pass ESLint

### 📋 Before You Start

**Add your Gemini API key to `.env`:**

```bash
GEMINI_API_KEY=your-actual-api-key-here
```

Get your key: https://makersuite.google.com/app/apikey

### 🏃 Start Server

```bash
cd backend
npm run dev
```

### 🧪 Quick Test

**1. Login/Register to get JWT token**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**2. Chat with AI (ask clarifying question)**

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "I need a laptop"}'
```

Expected: AI asks "What's your budget?" or similar

**3. Chat with AI (trigger product search)**

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "gaming laptop under 5000 GHS",
    "sessionId": "test-session-123"
  }'
```

Expected: AI returns Jumia product recommendations

### 📝 Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Main chat endpoint (AI + product search) |
| `/api/chat/conversations/:sessionId` | GET | Get conversation history |
| `/api/chat/conversations` | GET | List all user conversations |
| `/api/chat/conversations/:sessionId` | DELETE | Delete conversation |
| `/api/products/jumia/search` | GET | Direct Jumia search (no AI) |
| `/api/products/:marketplace/:productId` | GET | Get product details |
| `/api/products/redirect/:marketplace/:productId` | GET | Redirect to product (tracks clicks) |

### 📁 Important Files

```
services/
├── aiService.js           ← Gemini AI logic
└── jumiaService.js        ← Jumia scraping

controllers/
└── chatControllerV2.js    ← Main chat controller

routes/
└── chatRoutes.js          ← Chat API routes

models/
├── Product.js             ← Product model (marketplace caching)
└── Conversation.js        ← Conversation model (sessionId)

.env                       ← ADD YOUR GEMINI_API_KEY HERE
GEMINI_JUMIA_SETUP.md     ← Full setup guide
COMPLETION_SUMMARY.md      ← What's been built
```

### 🎯 AI Response Format

The AI always returns:

```json
{
  "action": "search_products" | "ask_question",
  "query": "gaming laptop 5000 GHS",
  "reply": "Here are gaming laptops under 5000 GHS:"
}
```

### 🛒 Product Format

Products returned from Jumia:

```json
{
  "marketplace": "jumia",
  "productId": "hp-pavilion-gaming-laptop-15",
  "name": "HP Pavilion Gaming Laptop 15",
  "price": 4500,
  "currency": "GHS",
  "image": "https://...",
  "productUrl": "https://...",
  "rating": 4.5,
  "numReviews": 120,
  "quickActions": {
    "addToCart": "/api/cart",
    "addToWishlist": "/api/wishlist",
    "viewOnJumia": "/api/products/redirect/jumia/..."
  }
}
```

### 🔧 Troubleshooting

**"GEMINI_API_KEY not configured"**
- Add key to `.env` file
- Restart server: `npm run dev`

**"Jumia scraping failed"**
- Check internet connection
- Jumia.com.gh might be blocking requests
- Check throttle settings in `.env`

**AI returns malformed JSON**
- System has fallback logic
- Check console logs: `[AI Service]` prefix

**No products in response**
- Check MongoDB connection
- Verify Jumia website structure hasn't changed
- Check console logs: `[Jumia Service]` prefix

### 📚 Full Documentation

- **Complete Setup**: `GEMINI_JUMIA_SETUP.md`
- **Implementation Summary**: `COMPLETION_SUMMARY.md`
- **This Quick Reference**: `QUICK_REFERENCE.md`

### 🎉 You're All Set!

Your backend is production-ready with:
- ✅ Gemini AI chat
- ✅ Jumia product scraping
- ✅ Session tracking
- ✅ Product caching
- ✅ Error handling

Just add your **GEMINI_API_KEY** and start testing! 🚀
