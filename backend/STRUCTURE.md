# 📁 Project Structure

## Current Backend Structure

```
backend/
├── config/                 # Configuration files
│   └── database.js         # MongoDB connection
│
├── controllers/            # Request handlers (business logic)
│   ├── adminController.js  # Admin operations
│   ├── authController.js   # Authentication & registration
│   ├── cartController.js   # Shopping cart management
│   ├── chatController.js   # Gemini AI chat + product discovery
│   ├── productController.js # Product CRUD + Jumia integration
│   ├── userController.js   # User profile management
│   └── wishlistController.js # Wishlist management
│
├── models/                 # Mongoose schemas
│   ├── Cart.js            # Shopping cart schema
│   ├── Conversation.js    # Chat conversation schema (with sessionId)
│   ├── Product.js         # Product schema (marketplace caching)
│   ├── User.js            # User schema
│   └── Wishlist.js        # Wishlist schema
│
├── routes/                 # API route definitions
│   ├── adminRoutes.js     # Admin endpoints
│   ├── authRoutes.js      # Auth endpoints
│   ├── cartRoutes.js      # Cart endpoints
│   ├── chatRoutes.js      # Chat endpoints (Gemini AI)
│   ├── productRoutes.js   # Product endpoints (incl. Jumia)
│   ├── userRoutes.js      # User endpoints
│   └── wishlistRoutes.js  # Wishlist endpoints
│
├── middleware/             # Express middleware
│   ├── admin.js           # Admin authorization
│   ├── auth.js            # JWT authentication
│   └── errorHandler.js    # Global error handler
│
├── services/               # Business logic layer
│   ├── aiService.js       # Gemini AI integration ✨
│   └── jumiaService.js    # Jumia Ghana product scraping ✨
│
├── utils/                  # Helper functions
│   └── .gitkeep
│
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── package.json            # Dependencies
├── .env.example            # Environment template
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
│
└── Documentation/
    ├── GEMINI_JUMIA_SETUP.md    # Complete setup guide
    ├── COMPLETION_SUMMARY.md     # Implementation summary
    ├── QUICK_REFERENCE.md        # Quick start reference
    ├── STRUCTURE.md              # This file
    └── README.md                 # Main documentation
```

## Architecture Pattern

We're following the **MVC + Services** pattern:

```
Request → Routes → Middleware → Controllers → Services → Models → Database
                                      ↓
                                  Response
```

### Layer Responsibilities

**Routes** (`/routes`)
- Define API endpoints
- Map URLs to controllers
- Apply route-specific middleware

**Controllers** (`/controllers`)
- Handle HTTP requests/responses
- Validate input
- Call services
- Format responses

**Services** (`/services`)
- **aiService.js**: Gemini AI integration for chat-based product discovery
- **jumiaService.js**: Scrape and cache products from Jumia Ghana
- Business logic that doesn't fit in controllers

**Models** (`/models`)
- Database schemas with validation
- Compound indexes for performance
- Virtual fields and methods

**Middleware** (`/middleware`)
- **auth.js**: JWT token verification
- **admin.js**: Admin role authorization
- **errorHandler.js**: Global error handling

**Config** (`/config`)
- **database.js**: MongoDB Atlas connection

## Key Features

### 1. **Gemini AI Chat System** 🤖
- **Controller**: `chatController.js`
- **Service**: `aiService.js`
- **Model**: `Conversation.js`
- **Routes**: `POST /api/chat`, `GET /api/chat/conversations`, etc.
- **Flow**: User message → Gemini AI → Structured JSON response → Optional product search

### 2. **Jumia Product Scraping** 🛍️
- **Service**: `jumiaService.js`
- **Model**: `Product.js` (caching)
- **Controller**: `productController.js`
- **Features**: Throttling, retry logic, MongoDB caching, exponential backoff

### 3. **Authentication & Authorization** 🔐
- **JWT-based** authentication
- **Middleware**: `auth.js` (protect routes), `admin.js` (admin-only routes)
- **Controller**: `authController.js`

### 4. **Shopping Features** 🛒
- **Cart**: Add/remove items, group by marketplace, calculate totals
- **Wishlist**: Save products, get price drop notifications
- **Controllers**: `cartController.js`, `wishlistController.js`

## API Endpoints

### Chat Endpoints (`/api/chat`)
```
POST   /                           # Main chat endpoint (Gemini AI + Jumia)
GET    /conversations              # List all user conversations
GET    /conversations/:sessionId   # Get conversation history
DELETE /conversations/:sessionId   # Delete conversation
```

### Product Endpoints (`/api/products`)
```
GET    /                          # Get all products (with filters)
GET    /featured                  # Get featured products
GET    /search                    # Search products
GET    /compare                   # Compare products
GET    /jumia/search              # Search Jumia Ghana
GET    /:marketplace/:productId   # Get product by marketplace ID
GET    /redirect/:marketplace/:productId  # Redirect to product (tracks clicks)
POST   /refresh/:marketplace/:productId   # Refresh product data (admin)
```

### Auth Endpoints (`/api/auth`)
```
POST   /register                  # Register new user
POST   /login                     # Login user
GET    /profile                   # Get user profile
PUT    /profile                   # Update user profile
```

### Cart Endpoints (`/api/cart`)
```
GET    /                          # Get user cart (grouped by marketplace)
POST   /                          # Add item to cart
PUT    /:itemId                   # Update cart item quantity
DELETE /:itemId                   # Remove item from cart
DELETE /                          # Clear cart
```

### Wishlist Endpoints (`/api/wishlist`)
```
GET    /                          # Get user wishlist
POST   /                          # Add item to wishlist
DELETE /:itemId                   # Remove item from wishlist
DELETE /                          # Clear wishlist
```

## Environment Variables

Your `.env` file should contain:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://...your-connection-string...

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# AI Service - Google Gemini (REQUIRED)
GEMINI_API_KEY=your-gemini-api-key-here

# Jumia Scraper
JUMIA_BASE_URL=https://www.jumia.com.gh
JUMIA_SCRAPER_USER_AGENT=Mozilla/5.0 (compatible; ECommerceBot/1.0)
SCRAPER_THROTTLE_MS=2000

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['user', 'admin'],
  createdAt: Date
}
```

### Product (Marketplace Cache)
```javascript
{
  marketplace: ['jumia', 'amazon', 'aliexpress', 'ebay', 'other'],
  productId: String,
  name: String,
  price: Number,
  currency: String (default: 'GHS'),
  image: String,
  productUrl: String,
  rating: Number,
  numReviews: Number,
  scrapedAt: Date,
  raw: Mixed (full scrape data)
}
// Unique index: {marketplace, productId}
```

### Conversation (Chat History)
```javascript
{
  user: ObjectId,
  sessionId: String,
  title: String,
  messages: [{
    role: ['user', 'assistant', 'system'],
    content: String,
    suggestedProducts: [ObjectId],
    metadata: Mixed
  }],
  intent: String,
  context: {
    userPreferences: {...},
    searchIntent: String,
    lastActivity: Date,
    marketplace: String
  }
}
```

### Cart
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    addedAt: Date
  }]
}
```

### Wishlist
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    addedAt: Date,
    notifyOnPriceDrop: Boolean
  }]
}
```

## Tech Stack

**Backend Framework**: Express.js 4.18.2
**Database**: MongoDB Atlas + Mongoose 8.0.3
**AI**: Google Gemini AI (gemini-1.5-flash) via @google/generative-ai
**Scraping**: Axios + Cheerio
**Authentication**: JWT (jsonwebtoken + bcryptjs)
**Currency**: GHS (Ghanaian Cedis)
**Marketplace**: Jumia Ghana (scalable to others)

## Best Practices Implemented

✅ **Separation of concerns** (MVC + Services pattern)
✅ **Environment-based configuration** (.env)
✅ **JWT authentication** with protected routes
✅ **Structured AI responses** (JSON format)
✅ **Product caching** (reduce external scraping)
✅ **Session-based conversations** (sessionId tracking)
✅ **Error handling** (global middleware)
✅ **Request throttling** (respectful scraping)
✅ **Exponential backoff** (retry logic)
✅ **Compound indexes** (performance optimization)
✅ **Clean code** (ESLint, modular architecture)
✅ **Comprehensive documentation**

## Development Workflow

1. **Start MongoDB** (or use MongoDB Atlas)
2. **Configure .env** (add your GEMINI_API_KEY)
3. **Install dependencies**: `npm install`
4. **Start dev server**: `npm run dev`
5. **Test endpoints** (see QUICK_REFERENCE.md)

## Scaling Considerations

### To Add More Marketplaces:
1. Create new service file: `services/amazonService.js`
2. Implement similar interface to `jumiaService.js`
3. Update `chatController.js` to call multiple services
4. Cart/Wishlist already support marketplace grouping

### To Add More AI Providers:
1. Create new service: `services/claudeService.js`
2. Implement same interface as `aiService.js`
3. Use environment variable to switch providers

---

**For complete setup instructions**, see `GEMINI_JUMIA_SETUP.md`
**For quick testing**, see `QUICK_REFERENCE.md`
**For implementation details**, see `COMPLETION_SUMMARY.md`
