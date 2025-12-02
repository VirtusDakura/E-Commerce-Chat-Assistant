# System Architecture Document
**E-Commerce Chat Assistant Backend**

**Version:** 1.0.0  
**Date:** December 2, 2025

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Architecture Style & Patterns](#2-architecture-style--patterns)
3. [Technology Stack](#3-technology-stack)
4. [System Components](#4-system-components)
5. [Data Flow Architecture](#5-data-flow-architecture)
6. [Request Lifecycle](#6-request-lifecycle)
7. [Module Dependencies](#7-module-dependencies)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Integration Architecture](#9-integration-architecture)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  (Web Browser, Mobile App, Third-party Integrations)            │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS/REST
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    API Gateway / Load Balancer                   │
│                     (Future - Not Implemented)                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   Express.js Application Server                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │   Routes   │→ │Middleware  │→ │Controllers │→ │ Services │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
└─────────────────────┬───────────────────┬───────────────────────┘
                      │                   │
        ┌─────────────▼───────┐  ┌────────▼──────────┐
        │   MongoDB Atlas     │  │  External APIs    │
        │  (Database Layer)   │  │  - Gemini AI      │
        │                     │  │  - Jumia Ghana    │
        └─────────────────────┘  └───────────────────┘
```

### 1.2 Architecture Characteristics

| Characteristic | Implementation |
|---------------|----------------|
| **Style** | Monolithic REST API |
| **Pattern** | Layered (MVC variant) |
| **Communication** | Synchronous HTTP |
| **State Management** | Stateless (JWT) |
| **Database** | MongoDB (NoSQL) |
| **Scalability** | Horizontal (stateless design) |
| **Deployment** | Single deployable unit |

---

## 2. Architecture Style & Patterns

### 2.1 Monolithic Architecture

**Design Choice:** Monolithic architecture chosen for:
- Simplicity of deployment
- Single codebase management
- Ease of development and debugging
- No network latency between components
- Suitable for current scale

**Structure:**
```
Single Node.js Process
├── HTTP Server (Express)
├── Application Logic
├── Data Access Layer
└── External Service Clients
```

**Trade-offs:**

**Advantages:**
- ✅ Simple deployment (single artifact)
- ✅ Easy local development
- ✅ No distributed system complexity
- ✅ Atomic transactions possible
- ✅ Straightforward debugging

**Disadvantages:**
- ⚠️ All components scale together
- ⚠️ Technology stack locked for entire app
- ⚠️ Longer build times as codebase grows
- ⚠️ Risk of tight coupling

---

### 2.2 Layered Architecture Pattern

**Layers:**

```
┌──────────────────────────────────────────┐
│         Presentation Layer               │  (routes/)
│  - Route definitions                     │
│  - Request validation                    │
│  - Response formatting                   │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│       Business Logic Layer               │  (controllers/)
│  - Request handling                      │
│  - Business rules                        │
│  - Orchestration                         │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│        Service Layer                     │  (services/)
│  - External integrations                 │
│  - AI processing                         │
│  - Web scraping                          │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│       Data Access Layer                  │  (models/)
│  - Mongoose ODM                          │
│  - Schema definitions                    │
│  - Database queries                      │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│         Database Layer                   │  (MongoDB)
│  - Data persistence                      │
│  - Indexing                              │
│  - Transactions                          │
└──────────────────────────────────────────┘
```

**Layer Responsibilities:**

**1. Presentation Layer (Routes)**
```javascript
// routes/chatRoutes.js
router.post('/', protect, chat);
router.get('/conversations', protect, getUserConversations);
```
- Define API endpoints
- Apply middleware
- No business logic

**2. Business Logic Layer (Controllers)**
```javascript
// controllers/chatController.js
export async function chat(req, res) {
  // Validate input
  // Call services
  // Format response
}
```
- Process requests
- Implement business rules
- Coordinate services
- Handle errors

**3. Service Layer (Services)**
```javascript
// services/aiService.js
export async function processMessage(message, history) {
  // Call Gemini AI
  // Process response
  // Return structured data
}
```
- External integrations
- Complex algorithms
- Reusable logic

**4. Data Access Layer (Models)**
```javascript
// models/User.js
const userSchema = new mongoose.Schema({...});
export default mongoose.model('User', userSchema);
```
- Define schemas
- Database operations
- Data validation

---

### 2.3 MVC Pattern Adaptation

**Modified MVC:**
```
Model (models/)      ←→  Controller (controllers/)  ←→  View (JSON Response)
       ↓                        ↓
   Database              Service Layer
                        (services/)
```

**Differences from Traditional MVC:**
- No template rendering (API only)
- Service layer added for external integrations
- View = JSON responses (not HTML)
- Controllers focus on HTTP handling

---

### 2.4 Repository Pattern (Implicit)

**Pattern Implementation:**
```javascript
// Mongoose acts as repository
const user = await User.findById(id);
const users = await User.find(query);
await user.save();
```

**Benefits:**
- Abstraction over database
- Consistent query interface
- Easy to mock for testing
- Database-agnostic code

---

## 3. Technology Stack

### 3.1 Core Technologies

```
┌─────────────────────────────────────────────────────────┐
│                    Technology Stack                      │
├─────────────────────────────────────────────────────────┤
│ Runtime         │ Node.js (v18+)                        │
│ Language        │ JavaScript (ES Modules)               │
│ Framework       │ Express.js 4.18.2                     │
│ Database        │ MongoDB (Mongoose ODM 8.0.3)          │
│ Authentication  │ JWT (jsonwebtoken 9.0.2)              │
│ Password Hash   │ bcryptjs 3.0.3                        │
│ AI Service      │ Google Gemini AI 0.24.1               │
│ Web Scraping    │ Axios 1.13.2 + Cheerio 1.1.2          │
│ Environment     │ dotenv 16.3.1                         │
│ CORS            │ cors 2.8.5                            │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Development Tools

```json
{
  "devDependencies": {
    "eslint": "^9.39.1",
    "nodemon": "^3.1.11",
    "@eslint/js": "^9.39.1",
    "globals": "^16.5.0"
  }
}
```

### 3.3 Technology Justification

| Technology | Reason for Choice |
|------------|-------------------|
| **Node.js** | Non-blocking I/O ideal for API server; JavaScript ecosystem |
| **Express.js** | Mature, minimal framework; extensive middleware ecosystem |
| **MongoDB** | Flexible schema for evolving data models; JSON-like documents |
| **Mongoose** | Strong ODM with validation, middleware, schema management |
| **JWT** | Stateless authentication; horizontally scalable |
| **Gemini AI** | Modern AI model; competitive pricing; good performance |
| **Axios** | Promise-based HTTP client; simple API; wide adoption |
| **Cheerio** | Server-side jQuery; fast HTML parsing |

---

## 4. System Components

### 4.1 Core Components

```
backend/
│
├── app.js                      # Application configuration
├── server.js                   # Server entry point
│
├── config/                     # Configuration
│   └── database.js            # MongoDB connection
│
├── middleware/                 # Cross-cutting concerns
│   ├── auth.js                # JWT authentication
│   └── errorHandler.js        # Error handling (in app.js)
│
├── routes/                     # API route definitions
│   ├── authRoutes.js          # /api/auth/*
│   ├── chatRoutes.js          # /api/chat/*
│   ├── productRoutes.js       # /api/products/*
│   ├── cartRoutes.js          # /api/cart/*
│   ├── wishlistRoutes.js      # /api/wishlist/*
│   ├── userRoutes.js          # /api/users/*
│   └── adminRoutes.js         # /api/admin/*
│
├── controllers/                # Request handlers
│   ├── authController.js      # Auth operations
│   ├── chatController.js      # Chat + AI
│   ├── productController.js   # Product operations
│   ├── cartController.js      # Cart management
│   ├── wishlistController.js  # Wishlist management
│   ├── userController.js      # User profile
│   └── adminController.js     # Admin operations
│
├── services/                   # External integrations
│   ├── aiService.js           # Gemini AI client
│   └── jumiaService.js        # Web scraper
│
├── models/                     # Data models
│   ├── User.js                # User schema
│   ├── Conversation.js        # Chat history
│   ├── Product.js             # Product cache
│   ├── Cart.js                # Shopping cart
│   ├── Wishlist.js            # User wishlist
│   └── TokenBlacklist.js      # Logout tokens
│
└── utils/                      # Utilities
    ├── jwt.js                 # JWT helper functions
    └── sendEmail.js           # Email utility
```

### 4.2 Component Descriptions

**Application Core (`app.js`, `server.js`)**
- Initialize Express application
- Register middleware (CORS, body-parser, error handler)
- Mount route handlers
- Start HTTP server
- Connect to database

**Configuration (`config/`)**
- `database.js`: MongoDB connection logic
- Environment-driven configuration

**Middleware (`middleware/`)**
- `auth.js`: JWT verification, user authentication, role-based authorization
- Error handler: Global error catching and formatting (in app.js)

**Routes (`routes/`)**
- Define HTTP endpoints
- Map routes to controllers
- Apply middleware (auth, validation)
- No business logic

**Controllers (`controllers/`)**
- Handle HTTP requests/responses
- Validate input
- Call services and models
- Format responses
- Error handling

**Services (`services/`)**
- `aiService.js`: Gemini AI integration, message processing
- `jumiaService.js`: Web scraping, HTML parsing, product caching

**Models (`models/`)**
- Mongoose schema definitions
- Validation rules
- Indexes
- Virtual fields
- Instance methods

**Utils (`utils/`)**
- JWT token generation/verification
- Email sending (simulated)
- Reusable helper functions

---

## 5. Data Flow Architecture

### 5.1 Read Operation Flow

```
Client
  │
  │ GET /api/products?category=Electronics
  │
  ▼
Express Router
  │
  │ Match route
  │
  ▼
Auth Middleware
  │
  │ Verify JWT
  │ Attach user to request
  │
  ▼
Product Controller
  │
  │ Parse query params
  │ Build filter query
  │
  ▼
Product Model
  │
  │ Query MongoDB
  │ Apply filters, pagination
  │
  ▼
MongoDB
  │
  │ Execute query
  │ Return documents
  │
  ▼
Product Controller
  │
  │ Format response
  │ Add pagination metadata
  │
  ▼
Client
  │
  │ JSON Response
  │ { success: true, data: [...] }
```

### 5.2 Write Operation Flow

```
Client
  │
  │ POST /api/cart/add
  │ { productId: "123", quantity: 2 }
  │
  ▼
Express Router
  │
  ▼
Auth Middleware
  │
  │ Verify token
  │
  ▼
Cart Controller
  │
  │ Validate input
  │ Check product exists
  │
  ▼
Product Model
  │
  │ Product.findById()
  │
  ▼
Cart Model
  │
  │ Cart.findOne({ user })
  │ Update or create cart
  │ Add/update item
  │ cart.save()
  │
  ▼
MongoDB
  │
  │ Persist changes
  │ Return updated document
  │
  ▼
Cart Controller
  │
  │ Format response
  │
  ▼
Client
  │
  │ { success: true, message: "Added to cart" }
```

### 5.3 AI-Powered Chat Flow

```
Client
  │
  │ POST /api/chat
  │ { message: "I need a laptop", sessionId: "abc123" }
  │
  ▼
Chat Controller
  │
  │ Authenticate user
  │ Find/create conversation
  │ Build conversation history
  │
  ▼
Conversation Model
  │
  │ Conversation.findOne({ sessionId, user })
  │ Get last 6 messages
  │
  ▼
AI Service (Gemini)
  │
  │ processMessage(message, history)
  │ Send to Gemini AI API
  │
  ▼
Google Gemini AI
  │
  │ Analyze message
  │ Return structured JSON
  │ { action: "ask_question", reply: "..." }
  │
  ▼
Chat Controller
  │
  │ Check action type
  │ If "search_products" → Call Jumia Service
  │
  ▼
Jumia Service (Optional)
  │
  │ searchJumia(query)
  │ HTTP GET to Jumia
  │ Parse HTML with Cheerio
  │ Extract products
  │
  ▼
Product Model
  │
  │ Cache products to MongoDB
  │ Product.findOneAndUpdate({ upsert: true })
  │
  ▼
Chat Controller
  │
  │ Save conversation with AI response
  │ Format products as recommendations
  │
  ▼
Conversation Model
  │
  │ conversation.messages.push(...)
  │ conversation.save()
  │
  ▼
Client
  │
  │ {
  │   action: "search_products",
  │   reply: "I found 12 laptops...",
  │   recommendations: [...]
  │ }
```

---

## 6. Request Lifecycle

### 6.1 Complete Request Processing

```
1. Client Request
   ↓
2. Node.js HTTP Server (Express)
   ↓
3. CORS Middleware
   │ - Check origin
   │ - Add CORS headers
   ↓
4. Body Parser Middleware
   │ - Parse JSON body
   │ - Parse URL-encoded data
   ↓
5. Route Matching
   │ - Match HTTP method + path
   │ - Extract route parameters
   ↓
6. Route-Specific Middleware
   │ - Authentication (protect)
   │ - Authorization (authorize)
   ↓
7. Controller Function
   │ - Validate input
   │ - Call business logic
   │ - Handle errors
   ↓
8. Service Layer (if needed)
   │ - External API calls
   │ - Complex processing
   ↓
9. Data Access Layer
   │ - Mongoose queries
   │ - Database operations
   ↓
10. MongoDB
    │ - Execute query
    │ - Return results
    ↓
11. Response Formatting
    │ - Success/error format
    │ - Status code
    │ - JSON serialization
    ↓
12. Error Handler (if error)
    │ - Catch exceptions
    │ - Log errors
    │ - Format error response
    ↓
13. HTTP Response
    │ - Send to client
    │ - Close connection
```

### 6.2 Middleware Chain Example

```javascript
// Express middleware chain for protected route
app.post('/api/chat',
  cors(),              // 1. CORS headers
  express.json(),      // 2. Parse JSON body
  protect,             // 3. JWT authentication
  chat                 // 4. Controller function
);

// Admin-only route
app.get('/api/admin/users',
  cors(),
  express.json(),
  protect,             // 1. Authenticate
  authorize('admin'),  // 2. Check role
  getAllUsers          // 3. Controller
);
```

---

## 7. Module Dependencies

### 7.1 Dependency Graph

```
server.js
  │
  ├─→ app.js
  │    │
  │    ├─→ Routes
  │    │    ├─→ authRoutes → authController → User, TokenBlacklist
  │    │    ├─→ chatRoutes → chatController → Conversation, Product
  │    │    │                     │
  │    │    │                     ├─→ aiService → Gemini AI
  │    │    │                     └─→ jumiaService → Product
  │    │    │
  │    │    ├─→ productRoutes → productController → Product
  │    │    │                         └─→ jumiaService
  │    │    │
  │    │    ├─→ cartRoutes → cartController → Cart, Product
  │    │    ├─→ wishlistRoutes → wishlistController → Wishlist, Product
  │    │    ├─→ userRoutes → userController → User
  │    │    └─→ adminRoutes → adminController → User
  │    │
  │    └─→ Middleware
  │         ├─→ auth → User, TokenBlacklist, jwt.js
  │         └─→ errorHandler (inline)
  │
  └─→ database.js → MongoDB
```

### 7.2 Inter-Module Communication

**Communication Patterns:**

1. **Controller → Service**
   ```javascript
   // Controller calls service
   const aiResponse = await processMessage(message, history);
   ```

2. **Controller → Model**
   ```javascript
   // Controller queries model
   const user = await User.findById(id);
   ```

3. **Service → Model**
   ```javascript
   // Service caches data
   await Product.findOneAndUpdate({ marketplace, productId }, data, { upsert: true });
   ```

4. **Middleware → Model**
   ```javascript
   // Middleware checks database
   const blacklisted = await TokenBlacklist.findOne({ token });
   ```

**Key Principles:**
- Controllers never call other controllers
- Services are reusable across controllers
- Models accessed directly (no repository abstraction)
- Middleware has limited model access

---

### 7.3 External Dependencies

```
Backend System
     │
     ├─→ MongoDB Atlas
     │    └─ Connection: Mongoose driver
     │
     ├─→ Google Gemini AI
     │    └─ Connection: @google/generative-ai SDK
     │
     └─→ Jumia Ghana
          └─ Connection: HTTP scraping (axios + cheerio)
```

**Dependency Management:**
- MongoDB: Critical dependency (app fails without it)
- Gemini AI: Degradable (fallback response available)
- Jumia: Degradable (cached products still accessible)

---

## 8. Deployment Architecture

### 8.1 Current Deployment Model

```
┌─────────────────────────────────────────┐
│        Single Server Deployment          │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Node.js Process (Port 5000)   │    │
│  │                                 │    │
│  │  - Express Server               │    │
│  │  - Application Code             │    │
│  │  - In-Memory State              │    │
│  └────────────────────────────────┘    │
│                                          │
└─────────────────────────────────────────┘
         │                      │
         │                      │
         ▼                      ▼
   MongoDB Atlas        Google Gemini AI
   (External)           (External)
```

### 8.2 Recommended Production Architecture

```
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │  Load Balancer │
              │   (Nginx/AWS)  │
              └────────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
  ┌─────────┐    ┌─────────┐    ┌─────────┐
  │Instance1│    │Instance2│    │Instance3│
  │Port 5000│    │Port 5000│    │Port 5000│
  └────┬────┘    └────┬────┘    └────┬────┘
       │              │              │
       └──────────────┼──────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
    MongoDB      Gemini AI     Redis
    (Primary)    (External)   (Cache)
         │
         ▼
    Replica Set
   (Secondary)
```

### 8.3 Scalability Options

**Vertical Scaling (Scale Up):**
- Increase server CPU/RAM
- Suitable for: 100-1000 concurrent users
- Limited by hardware constraints

**Horizontal Scaling (Scale Out):**
- Add more server instances
- Load balancer distributes traffic
- Stateless design enables this
- Requirements:
  - Shared token blacklist (Redis)
  - Shared session data (if any)
  - Database connection pooling

**Database Scaling:**
- Read replicas for read-heavy workloads
- Sharding for large datasets
- MongoDB Atlas auto-scaling

---

## 9. Integration Architecture

### 9.1 External System Integration

```
┌─────────────────────────────────────────────────────────┐
│                    Backend System                        │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │            AI Service Module                  │      │
│  │  - Gemini AI client                          │      │
│  │  - Message processing                        │      │
│  │  - Conversation context                      │      │
│  └──────────────────┬───────────────────────────┘      │
│                     │                                    │
│                     │ HTTPS API Call                    │
│                     ▼                                    │
│         ┌─────────────────────────┐                     │
│         │  Google Gemini AI API   │                     │
│         │  - Model: gemini-2.0    │                     │
│         │  - Rate: 60 req/min     │                     │
│         └─────────────────────────┘                     │
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │         Scraping Service Module               │      │
│  │  - HTTP client (Axios)                       │      │
│  │  - HTML parser (Cheerio)                     │      │
│  │  - Product extractor                         │      │
│  └──────────────────┬───────────────────────────┘      │
│                     │                                    │
│                     │ HTTP GET                           │
│                     ▼                                    │
│         ┌─────────────────────────┐                     │
│         │     Jumia Ghana         │                     │
│         │  - Search pages         │                     │
│         │  - Product pages        │                     │
│         └─────────────────────────┘                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Integration Patterns

**1. API Integration (Gemini AI)**
```javascript
// Pattern: Direct SDK usage
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Async request-response
const result = await model.generateContent(prompt);
```

**Characteristics:**
- Synchronous request-response
- SDK handles retries
- Rate limiting by provider
- Timeout: 30 seconds (default)

**2. Web Scraping (Jumia)**
```javascript
// Pattern: HTTP + HTML parsing
const response = await axios.get(url, {
  headers: { 'User-Agent': USER_AGENT },
  timeout: 10000
});

const $ = cheerio.load(response.data);
// Parse DOM
```

**Characteristics:**
- Synchronous HTTP requests
- Manual retry logic
- Throttling implemented
- Fragile (HTML structure changes)

### 9.3 API Contract Management

**Gemini AI Contract:**
```javascript
// Input
{
  "message": "string",
  "history": [
    { "role": "user|model", "parts": [{ "text": "string" }] }
  ]
}

// Output
{
  "action": "ask_question|search_products",
  "query": "string|null",
  "reply": "string"
}
```

**Jumia Scraping Contract:**
```javascript
// Input
{
  "query": "search term",
  "page": number,
  "limit": number
}

// Output
[
  {
    "marketplace": "jumia",
    "productId": "string",
    "title": "string",
    "price": number,
    "currency": "GHS",
    "image": "URL",
    "productUrl": "URL",
    "rating": number,
    "reviewsCount": number
  }
]
```

---

## 10. Architecture Decision Records (ADRs)

### ADR-001: Monolithic vs Microservices

**Decision:** Monolithic architecture  
**Date:** Project inception  
**Status:** Accepted

**Context:**
- Small team
- Single domain (e-commerce product discovery)
- No complex inter-service communication

**Decision:**
Deploy as single Node.js application with all features.

**Consequences:**
- ✅ Simple deployment
- ✅ Easy local development
- ⚠️ Scaling requires entire app scaling
- ⚠️ Technology stack locked

---

### ADR-002: MongoDB over SQL Database

**Decision:** MongoDB (NoSQL)  
**Date:** Project inception  
**Status:** Accepted

**Context:**
- Flexible schema for evolving product structure
- Different marketplaces have different data
- Conversation data is document-like

**Decision:**
Use MongoDB with Mongoose ODM.

**Consequences:**
- ✅ Schema flexibility
- ✅ JSON-like documents
- ✅ Easy to scale horizontally
- ⚠️ No ACID transactions (not needed)
- ⚠️ No foreign key constraints (managed in code)

---

### ADR-003: JWT Authentication

**Decision:** JWT tokens for authentication  
**Date:** Project inception  
**Status:** Accepted

**Context:**
- Need stateless authentication
- Support for horizontal scaling
- Mobile client support

**Decision:**
Use JWT with blacklist for logout.

**Consequences:**
- ✅ Stateless (no session storage)
- ✅ Horizontally scalable
- ✅ Client-side token storage
- ⚠️ Token cannot be revoked without blacklist
- ⚠️ Blacklist grows over time (TTL solves this)

---

### ADR-004: Real-time Scraping vs Pre-populated Database

**Decision:** Real-time scraping with caching  
**Date:** Project inception  
**Status:** Accepted

**Context:**
- Cannot legally copy entire Jumia catalog
- Product prices change frequently
- Need up-to-date data

**Decision:**
Scrape on-demand, cache results in MongoDB.

**Consequences:**
- ✅ Always fresh data
- ✅ No massive upfront data collection
- ⚠️ Slower first-time searches (3-8s)
- ⚠️ Dependent on external website structure
- ⚠️ Risk of rate limiting

---

### ADR-005: Gemini AI over OpenAI

**Decision:** Google Gemini AI  
**Date:** November 2025  
**Status:** Accepted

**Context:**
- Need conversational AI for product discovery
- Cost considerations
- Performance requirements

**Decision:**
Use Gemini 2.0-flash model.

**Consequences:**
- ✅ Competitive pricing
- ✅ Good performance (1-3s)
- ✅ Structured output support
- ⚠️ Less mature than GPT
- ⚠️ Single AI provider lock-in

---

## Summary

### Architecture Strengths

1. ✅ **Simple and maintainable** - Clear separation of concerns
2. ✅ **Scalable design** - Stateless, horizontally scalable
3. ✅ **Flexible data model** - MongoDB for evolving schemas
4. ✅ **Modern technology stack** - ES modules, async/await
5. ✅ **Clean layered architecture** - Easy to test and modify

### Architecture Weaknesses

1. ⚠️ **Monolithic limitations** - All components scale together
2. ⚠️ **External service dependency** - AI and scraping are critical
3. ⚠️ **No caching layer** - Could benefit from Redis
4. ⚠️ **Limited observability** - Basic logging only
5. ⚠️ **No API versioning** - Breaking changes affect all clients

### Future Improvements

1. Add Redis for caching and distributed state
2. Implement API versioning
3. Add comprehensive monitoring (APM)
4. Consider microservices for heavy operations (scraping)
5. Implement circuit breaker for external services
6. Add message queue for async operations

---

**Document Status:** ✅ Complete  
**Last Updated:** December 2, 2025  
**Next Review:** Quarterly or on major architectural changes
