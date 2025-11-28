# Gemini AI + Jumia Integration - Quick Start Guide

## Overview
This backend now uses **Google Gemini AI** (not OpenAI) to power intelligent product discovery through chat, with real-time **Jumia Ghana** scraping for product data.

## Architecture

### Core Components

1. **AI Service** (`services/aiService.js`)
   - Google Gemini AI integration
   - Returns structured JSON: `{action, query, reply}`
   - Actions: `search_products` | `ask_question`
   - Fallback logic for AI failures

2. **Chat Controller V2** (`controllers/chatControllerV2.js`)
   - Main endpoint: `POST /api/chat`
   - Integrates: Gemini AI + Jumia scraping + conversation storage
   - Session-based conversation tracking

3. **Jumia Service** (`services/jumiaService.js`)
   - Scrapes Jumia Ghana product search results
   - Features: throttling, caching, exponential backoff retry
   - Auto-caches products to MongoDB

4. **Product Model** (`models/Product.js`)
   - Caches scraped products from marketplaces
   - Unique index: `{marketplace, productId}`
   - Fields: marketplace, price, currency (GHS), scrapedAt, etc.

5. **Conversation Model** (`models/Conversation.js`)
   - Tracks chat history with sessionId
   - Stores: user messages, AI responses, suggested products
   - Context: user preferences, search intent, marketplace

## Setup

### 1. Get Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key (free tier available)
3. Copy the key

### 2. Configure Environment

Edit `/backend/.env`:

```bash
# Replace this with your actual Gemini API key
GEMINI_API_KEY=your-actual-gemini-api-key-here

# Jumia configuration (already set)
JUMIA_BASE_URL=https://www.jumia.com.gh
JUMIA_SCRAPER_USER_AGENT=Mozilla/5.0 (compatible; ECommerceBot/1.0)
SCRAPER_THROTTLE_MS=2000
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

Package installed: `@google/generative-ai`

### 4. Start Server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## API Endpoints

### Main Chat Endpoint

**POST** `/api/chat`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "I need a gaming laptop",
  "sessionId": "optional-client-generated-uuid"
}
```

**Response (Ask Question):**
```json
{
  "success": true,
  "action": "ask_question",
  "reply": "What's your budget for the gaming laptop?",
  "recommendations": [],
  "conversationId": "mongodb-conversation-id",
  "sessionId": "session-uuid",
  "metadata": {
    "intent": "shopping",
    "marketplace": "jumia"
  }
}
```

**Response (Search Products):**
```json
{
  "success": true,
  "action": "search_products",
  "reply": "Here are gaming laptops under 5000 GHS from Jumia:",
  "recommendations": [
    {
      "marketplace": "jumia",
      "productId": "hp-pavilion-gaming-laptop-15",
      "name": "HP Pavilion Gaming Laptop 15",
      "price": 4500,
      "currency": "GHS",
      "image": "https://jumia.com.gh/image.jpg",
      "productUrl": "https://jumia.com.gh/hp-pavilion...",
      "rating": 4.5,
      "numReviews": 120,
      "quickActions": {
        "addToCart": "/api/cart",
        "addToWishlist": "/api/wishlist",
        "viewOnJumia": "/api/products/redirect/jumia/hp-pavilion-gaming-laptop-15"
      }
    }
  ],
  "conversationId": "...",
  "sessionId": "...",
  "metadata": {...}
}
```

### Other Endpoints

- **GET** `/api/chat/conversations/:sessionId` - Get conversation history
- **GET** `/api/chat/conversations` - List all user conversations (paginated)
- **DELETE** `/api/chat/conversations/:sessionId` - Delete conversation

## Testing the Flow

### Test 1: Clarifying Question

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer <your-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a laptop"
  }'
```

**Expected:** AI asks clarifying question like "What's your budget?" or "What will you use it for?"

### Test 2: Product Search

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer <your-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "gaming laptop under 5000 GHS",
    "sessionId": "test-session-123"
  }'
```

**Expected:** AI triggers Jumia search, returns product recommendations

### Test 3: Conversation History

```bash
curl -X GET http://localhost:5000/api/chat/conversations/test-session-123 \
  -H "Authorization: Bearer <your-jwt>"
```

**Expected:** Returns all messages in that conversation

## How It Works

### Chat Flow

1. **User sends message** → `POST /api/chat`
2. **Controller validates** → Check userId, message, find/create conversation
3. **Build context** → Last 6 messages sent to AI
4. **Gemini AI processes** → Returns `{action, query, reply}`
5. **If action = "search_products"**:
   - Call `jumiaService.searchJumia(query)`
   - Products auto-cached to MongoDB
   - Format recommendations with quickActions
6. **Save to conversation** → Store assistant message + products
7. **Return response** → Client gets action, reply, recommendations

### AI Response Structure

Gemini AI is instructed to return ONLY this JSON format:

```json
{
  "action": "search_products",
  "query": "gaming laptop 5000 GHS",
  "reply": "Here are gaming laptops under 5000 GHS:"
}
```

OR

```json
{
  "action": "ask_question",
  "query": null,
  "reply": "What's your budget for the laptop?"
}
```

### Jumia Scraping

- **URL:** `https://www.jumia.com.gh/catalog/?q=<query>`
- **Throttling:** 2000ms between requests (respects Jumia)
- **Retry:** 3 attempts with exponential backoff
- **Caching:** Products stored in MongoDB to reduce scraping
- **Legal:** ⚠️ Check Jumia ToS before production use

### Product Caching

Products are automatically cached when searched:

- **Unique key:** `{marketplace: "jumia", productId: "..."}`
- **Update:** `scrapedAt` timestamp updated on each scrape
- **TTL:** No automatic expiration (manual refresh via API)

## Scaling to More Marketplaces

### Future Marketplaces

The system is designed to scale. To add Amazon, AliExpress, etc:

1. Create `services/amazonService.js` (similar to jumiaService.js)
2. Implement `searchAmazon(query)` → returns same format
3. Update `chatControllerV2.js`:
   ```javascript
   if (aiResponse.action === 'search_products') {
     const jumiaProducts = await searchJumia(query);
     const amazonProducts = await searchAmazon(query);
     const allProducts = [...jumiaProducts, ...amazonProducts];
   }
   ```
4. Cart/wishlist already group by marketplace

### Marketplace Format

Always use lowercase:

```javascript
{
  marketplace: "jumia",  // ✅ Correct
  marketplace: "Jumia",  // ❌ Wrong
}
```

## Cart & Wishlist

Products in cart/wishlist show marketplace grouping:

```json
{
  "cart": {
    "items": [...],
    "total": 15000,
    "itemsByPlatform": {
      "jumia": {
        "items": [...],
        "subtotal": 10000
      },
      "amazon": {
        "items": [...],
        "subtotal": 5000
      }
    }
  }
}
```

## Troubleshooting

### Error: "GEMINI_API_KEY not configured"

- Add your Gemini API key to `.env`
- Restart server: `npm run dev`

### Error: "Jumia scraping failed"

- Check internet connection
- Jumia.com.gh might be down or blocking requests
- Check throttle settings (increase `SCRAPER_THROTTLE_MS`)

### AI returns malformed JSON

- `parseAIResponse()` has fallback logic
- System will use rule-based response instead
- Check `console.log` for AI raw response

### Products not showing in response

- Check MongoDB connection
- Verify `jumiaService.searchJumia()` returns data
- Check console logs: `[Jumia Service]` prefix

## File Structure

```
backend/
├── services/
│   ├── aiService.js           # Gemini AI integration ✨
│   └── jumiaService.js        # Jumia scraping ✨
├── controllers/
│   ├── chatController.js      # Chat + AI + search ✨
│   └── productController.js   # Product CRUD + Jumia endpoints
├── models/
│   ├── Product.js             # Enhanced with marketplace fields
│   └── Conversation.js        # Enhanced with sessionId
├── routes/
│   ├── chatRoutes.js          # Updated chat endpoints
│   └── productRoutes.js       # Added Jumia endpoints
└── .env                       # GEMINI_API_KEY configured here

```

## Next Steps

1. ✅ **Test chat flow** - See "Testing the Flow" section
2. ⚠️ **Add validation middleware** - Input validation for chat endpoint
3. ⚠️ **Add rate limiting** - Prevent scraping abuse
4. ⚠️ **Create tests** - Unit tests for AI, Jumia, chat flow
5. ⚠️ **Add monitoring** - Log AI costs, scraping success rate
6. ⚠️ **Review Jumia ToS** - Legal compliance before production

## Notes

- **AI Model:** gemini-1.5-flash (fast, cheap, good for chat)
- **Temperature:** 0.7 (balanced creativity)
- **Max Tokens:** 500 (keeps responses concise)
- **Context:** Last 6 messages (prevents token overflow)
- **Fallback:** Rule-based responses if AI fails
- **Currency:** GHS (Ghanaian Cedis) for Jumia Ghana

## Support

Check these files for implementation details:

- `services/aiService.js` - AI logic and system prompts
- `controllers/chatControllerV2.js` - Complete chat flow
- `services/jumiaService.js` - Scraping implementation
- `models/Product.js` & `models/Conversation.js` - Data schemas

Happy coding! 🚀
