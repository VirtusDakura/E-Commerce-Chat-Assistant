# System Overview Document
**E-Commerce Chat Assistant Backend**

**Version:** 1.0.0  
**Date:** December 2, 2025  
**Author:** Technical Architecture Team

---

## 1. Executive Summary

The E-Commerce Chat Assistant Backend is an **AI-powered product discovery platform** that combines natural language processing with real-time web scraping to help users find and purchase products from external e-commerce marketplaces, primarily Jumia Ghana.

### System Purpose

Enable users to:
- Discover products through conversational AI chat interface
- Search multiple e-commerce platforms via natural language
- Manage shopping carts and wishlists across marketplaces
- Track conversations and shopping preferences
- Receive intelligent product recommendations

---

## 2. High-Level Description

### Architecture Type
**Monolithic REST API** with layered architecture pattern

### Core Technology Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB (via Mongoose 8.0.3)
- **AI Engine:** Google Gemini AI 2.0-flash
- **Web Scraping:** Axios + Cheerio
- **Authentication:** JWT with bcrypt

### System Characteristics
- **Stateless API** (JWT-based authentication)
- **Real-time scraping** (no product database pre-population)
- **Conversation-driven** (session-based chat history)
- **Multi-marketplace support** (currently Jumia, extensible to others)

---

## 3. Major Features

### 3.1 AI-Powered Chat Assistant
- Natural language product search
- Intelligent clarifying questions
- Context-aware recommendations
- Multi-turn conversations with history
- Session management

### 3.2 User Management
- Registration and authentication
- JWT-based secure sessions
- Token blacklisting for logout
- Password reset with email tokens
- Role-based access control (user/admin)

### 3.3 Product Discovery
- Real-time Jumia Ghana scraping
- Product caching in MongoDB
- Advanced search with filters
- Product comparison
- Featured products

### 3.4 Shopping Management
- Multi-platform shopping cart
- Wishlist with price tracking
- Price change alerts
- Priority-based organization
- External checkout redirection

### 3.5 Admin Panel
- User management (CRUD)
- System statistics
- Product data refresh
- Platform monitoring

---

## 4. Key Workflows

### 4.1 Product Discovery Flow
```
User → Chat Message → Gemini AI Analysis → 
  ├─ Clarifying Question → User Response
  └─ Search Trigger → Jumia Scraper → Products → Cache → Response
```

### 4.2 Authentication Flow
```
User → Register/Login → JWT Generation → 
Token Storage → Protected Routes → Token Verification → Access
```

### 4.3 Shopping Flow
```
User → Browse Products → Add to Cart/Wishlist → 
Group by Platform → Redirect to Marketplace → External Checkout
```

### 4.4 Conversation Management
```
User Message → Session Check → History Retrieval → 
AI Processing → Response Generation → History Update → MongoDB Storage
```

---

## 5. Main Modules and Responsibilities

### 5.1 Authentication Module (`authController.js`)
**Responsibilities:**
- User registration with validation
- Login with password verification
- Token generation and management
- Password reset functionality
- Token blacklisting for logout

**Key Operations:**
- `register()` - Create new user account
- `login()` - Authenticate and issue JWT
- `logout()` - Invalidate JWT token
- `forgotPassword()` - Generate reset token
- `resetPassword()` - Update password with token

---

### 5.2 Chat Module (`chatController.js`, `aiService.js`)
**Responsibilities:**
- Process natural language queries
- Manage conversation sessions
- Integrate AI with product search
- Store conversation history
- Generate contextual responses

**Key Operations:**
- `chat()` - Main chat endpoint
- `processMessage()` - AI message processing
- `getConversationHistory()` - Retrieve past messages
- `getUserConversations()` - List all sessions
- `deleteConversation()` - Remove chat history

**AI Service Features:**
- Structured JSON response format
- Action classification (ask_question/search_products)
- Context-aware conversations
- Fallback error handling

---

### 5.3 Product Module (`productController.js`, `jumiaService.js`)
**Responsibilities:**
- Real-time Jumia scraping
- Product data caching
- Search and filtering
- Product comparison
- Redirect tracking

**Key Operations:**
- `searchJumiaProducts()` - Live scraping
- `searchJumia()` - Service-level scraper
- `getAllProducts()` - Database retrieval with filters
- `getProductByMarketplaceId()` - Find cached product
- `refreshProductData()` - Admin: Update product
- `compareProducts()` - Side-by-side comparison

**Scraping Features:**
- Throttled requests (2s delay)
- Exponential backoff retry
- HTML parsing with Cheerio
- Automatic caching to MongoDB
- Price/rating extraction

---

### 5.4 Cart Module (`cartController.js`)
**Responsibilities:**
- Manage user shopping carts
- Group items by platform
- Calculate totals
- Platform checkout preparation

**Key Operations:**
- `getCart()` - Retrieve user cart
- `addToCart()` - Add product with validation
- `updateCartItem()` - Modify quantity
- `removeFromCart()` - Delete item
- `clearCart()` - Empty cart

**Features:**
- Platform grouping for multi-marketplace
- Total price calculation
- Duplicate detection
- Quantity validation

---

### 5.5 Wishlist Module (`wishlistController.js`)
**Responsibilities:**
- Manage user wishlists
- Price change tracking
- Priority management
- Price alerts

**Key Operations:**
- `getWishlist()` - Retrieve with price changes
- `addToWishlist()` - Add with price snapshot
- `removeFromWishlist()` - Delete item
- `updateWishlistItem()` - Modify priority/notes
- `clearWishlist()` - Empty list

**Features:**
- Saved price comparison
- Price drop detection
- Priority levels (high/medium/low)
- User notes
- Collections/folders

---

### 5.6 User Module (`userController.js`)
**Responsibilities:**
- User profile management
- Password changes
- Profile updates

**Key Operations:**
- `getProfile()` - Get current user
- `updateProfile()` - Modify user data
- `changePassword()` - Update password

---

### 5.7 Admin Module (`adminController.js`)
**Responsibilities:**
- User administration
- System monitoring
- Data management

**Key Operations:**
- `getAllUsers()` - List with pagination
- `getUserById()` - Specific user details
- `updateUser()` - Modify user (including role)
- `deleteUser()` - Remove user
- `getStats()` - System statistics

---

## 6. Data Flow Architecture

### Request Flow
```
Client Request
    ↓
Express Middleware (CORS, JSON parsing)
    ↓
Route Handler (route validation)
    ↓
Auth Middleware (JWT verification)
    ↓
Controller (business logic)
    ↓
Service Layer (AI/Scraping)
    ↓
Database Layer (MongoDB via Mongoose)
    ↓
Response Formatter
    ↓
Client Response
```

### Chat Request Detailed Flow
```
POST /api/chat
    ↓
protect middleware (JWT check)
    ↓
chatController.chat()
    ↓
Conversation.findOne() [Check session]
    ↓
aiService.processMessage() [Gemini AI]
    ↓
├─ action: "ask_question" → Return clarification
└─ action: "search_products" → jumiaService.searchJumia()
                                    ↓
                               Web Scraping (Cheerio)
                                    ↓
                               Product.findOneAndUpdate() [Cache]
                                    ↓
                               Return products array
    ↓
Conversation.save() [Store history]
    ↓
Format response with recommendations
    ↓
JSON Response to client
```

---

## 7. External Dependencies

### 7.1 External APIs
| Service | Purpose | Integration |
|---------|---------|-------------|
| Google Gemini AI | Natural language processing | @google/generative-ai |
| Jumia Ghana | Product data source | Web scraping (axios + cheerio) |

### 7.2 Third-Party Services
- **MongoDB Atlas** - Cloud database
- **Email Service** - Password reset (not implemented, console simulation)

---

## 8. System Boundaries

### What the System Does
✅ AI-powered product discovery  
✅ Real-time marketplace scraping  
✅ User authentication and authorization  
✅ Conversation history management  
✅ Shopping cart and wishlist  
✅ Product caching and search  

### What the System Does NOT Do
❌ Payment processing (redirects to external platforms)  
❌ Order fulfillment  
❌ Inventory management  
❌ Product hosting  
❌ Email delivery (currently simulated)  
❌ Image hosting (uses external CDN URLs)  

---

## 9. Deployment Architecture

### Environment Variables Required
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=secret_key
JWT_EXPIRE=7d
GEMINI_API_KEY=your_key
JUMIA_BASE_URL=https://www.jumia.com.gh
SCRAPER_THROTTLE_MS=2000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=email@example.com
EMAIL_PASSWORD=app_password
```

### Server Startup Sequence
1. Load environment variables (dotenv)
2. Connect to MongoDB (async)
3. Initialize Express app
4. Register middleware (CORS, body-parser)
5. Mount route handlers
6. Start HTTP server on PORT
7. Log startup confirmation

---

## 10. Performance Characteristics

### Response Times (Observed)
- Authentication: < 100ms
- Product search (cached): < 200ms
- Product search (live scraping): 3-8 seconds
- Chat response: 1-3 seconds (AI processing)
- Cart/Wishlist operations: < 100ms

### Scalability Considerations
- **Stateless design** - Easy horizontal scaling
- **MongoDB indexing** - Optimized queries
- **Scraping throttling** - Prevents rate limiting
- **Token blacklist** - TTL index for auto-cleanup

### Bottlenecks
- Jumia scraping (network latency)
- Gemini AI API calls (external dependency)
- Conversation history queries (grows over time)

---

## 11. Security Overview

### Authentication
- JWT tokens (7-day expiration)
- Bcrypt password hashing (10 rounds)
- Token blacklist on logout

### Authorization
- Role-based access control (user/admin)
- Middleware-enforced permissions

### Data Protection
- Password field excluded from queries
- Reset tokens hashed (SHA-256)
- CORS enabled for frontend integration

---

## 12. Monitoring and Logging

### Current Logging
- Console logging for all operations
- Error stack traces in development
- Request/response logging

### Metrics Tracked
- User registrations
- Conversation counts
- Product searches
- Scraping success/failure rates

---

## 13. Future Extensibility

### Planned Extensions
1. **Multi-marketplace support** - Amazon, AliExpress, eBay
2. **Email service integration** - Real email sending
3. **Advanced analytics** - User behavior tracking
4. **Recommendation engine** - ML-based suggestions
5. **Price history tracking** - Long-term price trends
6. **Notification system** - Price alerts, stock updates

### Architecture Supports
- Pluggable marketplace scrapers
- Extensible AI service layer
- Modular controller design
- Schema versioning via Mongoose

---

## 14. System Limitations

### Technical Limitations
- **Single AI provider** - Gemini AI only
- **No real-time updates** - Products cached until refresh
- **Web scraping dependency** - Vulnerable to HTML changes
- **No pagination** - Conversation history retrieval
- **Simulated email** - Password reset requires manual intervention

### Business Limitations
- **Affiliate tracking** - Not implemented
- **Monetization** - No commission system
- **User verification** - Email not verified
- **Rate limiting** - Basic throttling only

---

## 15. Success Metrics

### System Health Indicators
- API uptime: Target 99.9%
- Average response time: < 500ms (excluding scraping)
- AI success rate: > 95%
- Scraping success rate: > 90%

### User Engagement Metrics
- Daily active users
- Conversations per user
- Products added to cart
- Search queries per session

---

## 16. Glossary

| Term | Definition |
|------|------------|
| **Session** | A unique conversation identifier (sessionId) |
| **Marketplace** | External e-commerce platform (Jumia, Amazon, etc.) |
| **Scraping** | Automated extraction of data from web pages |
| **Token Blacklist** | List of invalidated JWT tokens |
| **Product Cache** | MongoDB storage of scraped products |
| **Conversation Context** | User preferences and search intent stored per session |
| **Platform Group** | Cart items grouped by marketplace for checkout |

---

**Document Status:** ✅ Complete  
**Last Updated:** December 2, 2025  
**Next Review:** As needed for architecture changes
