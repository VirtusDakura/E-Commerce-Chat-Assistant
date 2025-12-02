# C4 Model Diagrams
**E-Commerce Chat Assistant Backend**

**Version:** 1.0.0  
**Date:** December 2, 2025

---

## Table of Contents
1. [Introduction to C4 Model](#1-introduction-to-c4-model)
2. [Level 1: System Context Diagram](#2-level-1-system-context-diagram)
3. [Level 2: Container Diagram](#3-level-2-container-diagram)
4. [Level 3: Component Diagram](#4-level-3-component-diagram)
5. [Supporting Diagrams](#5-supporting-diagrams)

---

## 1. Introduction to C4 Model

### 1.1 What is C4?

The C4 model is a hierarchical approach to software architecture diagrams:
- **Level 1: System Context** - How the system fits in the world
- **Level 2: Container** - High-level technology choices
- **Level 3: Component** - Components within containers
- **Level 4: Code** - Class diagrams (not included)

### 1.2 Notation

```
┌─────────────────┐
│     Person      │  = User/Actor
│   [Description] │
└─────────────────┘

┌─────────────────┐
│  Software       │  = External System
│  System         │
│ [Technology]    │
└─────────────────┘

┌─────────────────┐
│  Container      │  = Application/Database/Service
│ [Technology]    │
└─────────────────┘

┌─────────────────┐
│  Component      │  = Module/Package within container
│ [Description]   │
└─────────────────┘

───────────>  = Relationship/Data Flow
```

---

## 2. Level 1: System Context Diagram

### 2.1 Context Diagram

```
                                    ┌──────────────────────┐
                                    │   Customer (User)    │
                                    │  [Person]            │
                                    │                      │
                                    │ Uses the system to   │
                                    │ discover products    │
                                    │ via AI chat          │
                                    └──────────┬───────────┘
                                               │
                                               │ Searches products
                                               │ Manages cart/wishlist
                                               │ [HTTPS/REST API]
                                               │
                                               ▼
    ┌───────────────────────────────────────────────────────────────────┐
    │                                                                   │
    │        E-Commerce Chat Assistant Backend System                  │
    │               [Node.js Application]                              │
    │                                                                   │
    │   AI-powered e-commerce product discovery platform that helps   │
    │   users find products from online marketplaces through natural   │
    │   language conversation. Integrates with external AI and web     │
    │   scraping to provide personalized recommendations.              │
    │                                                                   │
    └───────┬──────────────────────────┬──────────────────┬────────────┘
            │                          │                  │
            │ Sends prompts            │ Scrapes          │ Stores/retrieves
            │ Receives AI              │ product data     │ data
            │ responses                │ [HTTPS]          │ [MongoDB Protocol]
            │ [HTTPS/REST]             │                  │
            ▼                          ▼                  ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  Google Gemini AI   │  │    Jumia Ghana      │  │   MongoDB Atlas     │
│  [External System]  │  │  [External System]  │  │  [Database System]  │
│                     │  │                     │  │                     │
│ Provides natural    │  │ E-commerce          │  │ Cloud-hosted NoSQL  │
│ language            │  │ marketplace that    │  │ database storing    │
│ understanding and   │  │ provides product    │  │ users, products,    │
│ generates           │  │ listings and        │  │ carts, wishlists,   │
│ conversational      │  │ details for         │  │ and conversations   │
│ responses           │  │ scraping            │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘


                         ┌─────────────────────┐
                         │   Administrator     │
                         │     [Person]        │
                         │                     │
                         │ Manages users,      │
                         │ refreshes product   │
                         │ data                │
                         └──────────┬──────────┘
                                    │
                                    │ Admin operations
                                    │ [HTTPS/REST API]
                                    │
                                    ▼
                         (Connects to same system above)
```

### 2.2 System Context Description

**Primary System:**
- **Name:** E-Commerce Chat Assistant Backend
- **Type:** Web Application Backend
- **Technology:** Node.js with Express.js
- **Purpose:** AI-powered product discovery through conversational interface

**External Entities:**

| Entity | Type | Interaction | Protocol |
|--------|------|-------------|----------|
| **Customer (User)** | Person | Searches products, manages shopping cart/wishlist via chat | HTTPS/REST |
| **Administrator** | Person | Manages users, refreshes product data | HTTPS/REST |
| **Google Gemini AI** | External System | Provides AI-powered conversation and intent detection | HTTPS/REST API |
| **Jumia Ghana** | External System | E-commerce marketplace for product data | HTTPS (Web Scraping) |
| **MongoDB Atlas** | Database System | Persistent data storage | MongoDB Protocol |

**Key Interactions:**

1. **User → System:** 
   - Authenticate and manage account
   - Chat with AI assistant
   - Search and browse products
   - Manage cart and wishlist

2. **System → Gemini AI:**
   - Send user messages with conversation history
   - Receive AI-generated responses and product search queries

3. **System → Jumia Ghana:**
   - HTTP requests to search pages
   - Parse HTML for product information
   - Extract product details, prices, images

4. **System → MongoDB:**
   - Store user accounts, conversations, products (cached)
   - Persist shopping carts and wishlists
   - Manage authentication tokens

---

## 3. Level 2: Container Diagram

### 3.1 Container Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                E-Commerce Chat Assistant Backend System                      │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │                    Web Application Server                           │    │
│  │                   [Node.js + Express.js]                           │    │
│  │                                                                     │    │
│  │  RESTful API server that handles HTTP requests, implements         │    │
│  │  business logic, orchestrates AI interactions, performs web        │    │
│  │  scraping, and manages data persistence. Exposes 33 endpoints      │    │
│  │  across 7 route groups (auth, chat, products, cart, wishlist,     │    │
│  │  users, admin).                                                    │    │
│  │                                                                     │    │
│  │  Key Technologies:                                                 │    │
│  │  - Express 4.18.2 (HTTP framework)                                │    │
│  │  - Mongoose 8.0.3 (MongoDB ODM)                                   │    │
│  │  - JWT + bcrypt (Authentication)                                  │    │
│  │  - @google/generative-ai (AI client)                             │    │
│  │  - Axios + Cheerio (Web scraping)                                │    │
│  │                                                                     │    │
│  └──────┬────────────────────┬─────────────────────┬─────────────────┘    │
│         │                    │                     │                       │
└─────────┼────────────────────┼─────────────────────┼───────────────────────┘
          │                    │                     │
          │ Reads/Writes       │ API Calls          │ HTTP GET
          │ [MongoDB Protocol] │ [HTTPS/JSON]       │ [HTTPS]
          │                    │                     │
          ▼                    ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  MongoDB Database   │  │  Gemini AI Service  │  │  Jumia Web Server   │
│   [MongoDB Atlas]   │  │  [External API]     │  │  [External System]  │
│                     │  │                     │  │                     │
│ NoSQL database      │  │ Google's            │  │ E-commerce website  │
│ storing:            │  │ generative AI       │  │ HTML pages with     │
│                     │  │ model that          │  │ product listings    │
│ - users             │  │ processes natural   │  │ and details         │
│ - conversations     │  │ language and        │  │                     │
│ - products (cache)  │  │ generates JSON      │  │ Pages scraped:      │
│ - carts             │  │ responses           │  │ - Search results    │
│ - wishlists         │  │                     │  │ - Product pages     │
│ - token_blacklist   │  │ Model:              │  │                     │
│                     │  │ gemini-2.0-flash    │  │ Rate: Throttled     │
│ Indexes on:         │  │                     │  │ 2s between requests │
│ - email (unique)    │  │ Rate limit:         │  │                     │
│ - sessionId         │  │ 60 requests/min     │  │                     │
│ - marketplace+id    │  │                     │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘


         ▲                                    ▲
         │                                    │
         │ HTTPS/JSON Requests                │ HTTPS/JSON Requests
         │ (JWT Bearer Token)                 │ (JWT Bearer Token)
         │                                    │
         │                                    │
┌────────┴──────────┐              ┌─────────┴───────────┐
│  Web Client       │              │  Mobile Client      │
│  [Browser SPA]    │              │  [iOS/Android]      │
│                   │              │                     │
│ Single-page       │              │ Native mobile       │
│ application that  │              │ application         │
│ provides chat UI  │              │ (Future)            │
└───────────────────┘              └─────────────────────┘
```

### 3.2 Container Descriptions

#### Container 1: Web Application Server

**Name:** Web Application Server  
**Technology:** Node.js 18+ with Express.js 4.18.2  
**Deployment:** Single Node.js process on port 5000  
**Responsibilities:**
- Handle HTTP requests/responses
- Authenticate and authorize users
- Implement business logic
- Orchestrate AI conversations
- Perform web scraping
- Cache product data
- Manage shopping cart and wishlist

**Key Dependencies:**
```json
{
  "express": "4.18.2",
  "mongoose": "8.0.3",
  "jsonwebtoken": "9.0.2",
  "bcryptjs": "3.0.3",
  "@google/generative-ai": "0.24.1",
  "axios": "1.13.2",
  "cheerio": "1.1.2"
}
```

**Exposed Endpoints:** 33 total across 7 groups:
- `/api/auth/*` - Authentication (5 endpoints)
- `/api/chat/*` - AI chat (4 endpoints)
- `/api/products/*` - Product operations (9 endpoints)
- `/api/cart/*` - Shopping cart (5 endpoints)
- `/api/wishlist/*` - Wishlist (5 endpoints)
- `/api/users/*` - User profile (3 endpoints)
- `/api/admin/*` - Admin operations (4 endpoints)

---

#### Container 2: MongoDB Database

**Name:** MongoDB Database  
**Technology:** MongoDB Atlas (Cloud-hosted)  
**Version:** 6.0+  
**Responsibilities:**
- Persist all application data
- Index for fast queries
- Maintain data relationships
- TTL expiration for token blacklist

**Collections:**

| Collection | Documents | Indexes | Purpose |
|------------|-----------|---------|---------|
| users | User accounts | email (unique) | Authentication & profiles |
| conversations | Chat history | user+isActive, sessionId | AI conversation tracking |
| products | Cached products | marketplace+productId (unique), name/description (text) | Product catalog cache |
| carts | Shopping carts | user (unique) | Shopping cart persistence |
| wishlists | User wishlists | user (unique), items.product | Wishlist with price tracking |
| tokenblacklists | Revoked tokens | token (unique), expiresAt (TTL) | JWT logout mechanism |

**Connection:**
- Protocol: MongoDB Wire Protocol
- Connection String: `mongodb+srv://...` (from .env)
- Driver: Mongoose ODM 8.0.3

---

#### Container 3: Gemini AI Service

**Name:** Google Gemini AI Service  
**Technology:** Google Generative AI API  
**Model:** gemini-2.0-flash  
**Responsibilities:**
- Process natural language messages
- Understand user intent
- Generate conversational responses
- Extract product search queries
- Provide structured JSON output

**API Contract:**

**Request:**
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "I need a laptop for gaming" }]
    }
  ],
  "systemInstruction": {
    "parts": [{ "text": "You are an e-commerce assistant..." }]
  }
}
```

**Response:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "{\"action\":\"search_products\",\"query\":\"gaming laptop\",\"reply\":\"Let me find gaming laptops for you...\"}"
      }]
    }
  }]
}
```

**Rate Limits:**
- 60 requests per minute
- 2 million tokens per minute

---

#### Container 4: Jumia Web Server

**Name:** Jumia Ghana Website  
**Technology:** PHP/JavaScript web application  
**URL:** https://www.jumia.com.gh  
**Responsibilities:**
- Display product listings
- Provide product search
- Serve product detail pages

**Scraping Approach:**
- HTTP GET requests to search URLs
- Parse HTML with Cheerio (jQuery-like)
- Extract product data from DOM structure
- Throttle: 2 seconds between requests
- Retry logic: 3 attempts with exponential backoff

**Data Extracted:**
- Product title
- Price (GHS currency)
- Product URL
- Image URL
- Rating and review count
- Category information

---

### 3.3 Inter-Container Communication

**Flow 1: User Authentication**
```
Web Client → Web Application Server → MongoDB
         JWT Token ←
```

**Flow 2: AI Chat with Product Search**
```
Web Client → Web Application Server → Gemini AI Service
                   ↓                        ↓
              MongoDB              (Get AI response)
                   ↓                        ↓
         Jumia Web Server ← (Extract search query)
                   ↓
            (Scrape products)
                   ↓
              MongoDB (Cache products)
                   ↓
         Web Client ← (Return recommendations)
```

**Flow 3: Product Browsing**
```
Web Client → Web Application Server → MongoDB
                                      (Query cached products)
                                            ↓
                                    Web Client ← (Return products)
```

---

## 4. Level 3: Component Diagram

### 4.1 Component Diagram - Web Application Server

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Web Application Server Container                         │
│                          [Node.js + Express.js]                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        HTTP Layer                                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │ CORS         │  │ Body Parser  │  │ Error Handler│             │   │
│  │  │ Middleware   │→ │ Middleware   │→ │ Middleware   │             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                  ↓                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Route Layer                                   │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐      │   │
│  │  │ Auth       │ │ Chat       │ │ Product    │ │ Cart       │      │   │
│  │  │ Routes     │ │ Routes     │ │ Routes     │ │ Routes     │      │   │
│  │  └──────┬─────┘ └──────┬─────┘ └──────┬─────┘ └──────┬─────┘      │   │
│  │         │              │              │              │             │   │
│  │  ┌──────┴─────┐ ┌──────┴─────┐ ┌──────┴─────┐ ┌──────┴─────┐      │   │
│  │  │ Wishlist   │ │ User       │ │ Admin      │ │ Health     │      │   │
│  │  │ Routes     │ │ Routes     │ │ Routes     │ │ Check      │      │   │
│  │  └──────┬─────┘ └──────┬─────┘ └──────┬─────┘ └────────────┘      │   │
│  └─────────┼──────────────┼──────────────┼──────────────────────────┘   │
│            │              │              │                               │
│  ┌─────────▼──────────────▼──────────────▼──────────────────────────┐   │
│  │                   Security Layer                                  │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐             │   │
│  │  │ Auth Middleware      │  │ Authorization        │             │   │
│  │  │ [protect()]          │  │ Middleware           │             │   │
│  │  │                      │  │ [authorize(roles)]   │             │   │
│  │  │ - Verify JWT         │  │                      │             │   │
│  │  │ - Check blacklist    │  │ - Check user role    │             │   │
│  │  │ - Load user          │  │ - Allow/deny access  │             │   │
│  │  └──────────────────────┘  └──────────────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  ↓                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Controller Layer                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │ Auth         │  │ Chat         │  │ Product      │             │   │
│  │  │ Controller   │  │ Controller   │  │ Controller   │             │   │
│  │  │              │  │              │  │              │             │   │
│  │  │ - register() │  │ - chat()     │  │ - getAllPro. │             │   │
│  │  │ - login()    │  │ - getConv.() │  │ - searchPro. │             │   │
│  │  │ - logout()   │  │ - deleteConv.│  │ - getFeat.() │             │   │
│  │  │ - forgotPwd()│  │              │  │ - compare()  │             │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │   │
│  │         │                 │                 │                      │   │
│  │  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐             │   │
│  │  │ Cart         │  │ Wishlist     │  │ User         │             │   │
│  │  │ Controller   │  │ Controller   │  │ Controller   │             │   │
│  │  │              │  │              │  │              │             │   │
│  │  │ - getCart()  │  │ - getWish.() │  │ - getProfile()│            │   │
│  │  │ - addToCart()│  │ - addToWish()│  │ - updatePro. │             │   │
│  │  │ - updateItem │  │ - updateItem │  │ - changePwd. │             │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │   │
│  │         │                 │                 │                      │   │
│  │  ┌──────┴──────────────────────────────────┴───────┐              │   │
│  │  │         Admin Controller                         │              │   │
│  │  │  - getAllUsers()  - updateUser()                 │              │   │
│  │  │  - getUserById()  - deleteUser()                 │              │   │
│  │  └──────────────────────────────────────────────────┘              │   │
│  └───────────────────────┬──────────────────┬──────────────────────────┘   │
│                          │                  │                             │
│  ┌───────────────────────▼──────────────────▼──────────────────────────┐   │
│  │                      Service Layer                                   │   │
│  │  ┌────────────────────────────┐  ┌────────────────────────────┐    │   │
│  │  │   AI Service Component     │  │  Scraping Service Component│    │   │
│  │  │   [aiService.js]           │  │  [jumiaService.js]         │    │   │
│  │  │                            │  │                            │    │   │
│  │  │ - processMessage()         │  │ - searchJumia()            │    │   │
│  │  │   • Initialize Gemini AI   │  │   • throttleRequest()      │    │   │
│  │  │   • Build conversation     │  │   • retryWithBackoff()     │    │   │
│  │  │   • Call AI model          │  │   • HTTP GET request       │    │   │
│  │  │   • Parse JSON response    │  │   • Parse HTML (Cheerio)   │    │   │
│  │  │   • Extract intent/query   │  │   • Extract product data   │    │   │
│  │  │   • Return structured data │  │   • Cache to MongoDB       │    │   │
│  │  │                            │  │   • Return product array   │    │   │
│  │  │ - Fallback logic           │  │                            │    │   │
│  │  │   if AI fails              │  │ - Rate limiting (2s)       │    │   │
│  │  └────────────┬───────────────┘  └────────────┬───────────────┘    │   │
│  └───────────────┼──────────────────────────────┼────────────────────┘   │
│                  │                              │                         │
│                  │ Calls                        │ Calls                   │
│                  ▼                              ▼                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       Data Access Layer                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │ User Model   │  │ Conversation │  │ Product Model│             │   │
│  │  │              │  │ Model        │  │              │             │   │
│  │  │ - Schema     │  │              │  │ - Schema     │             │   │
│  │  │ - Validators │  │ - Schema     │  │ - Indexes    │             │   │
│  │  │ - Indexes    │  │ - Indexes    │  │ - Text search│             │   │
│  │  │ - Pre-save   │  │ - References │  │ - Unique key │             │   │
│  │  │   (bcrypt)   │  │              │  │              │             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │ Cart Model   │  │ Wishlist     │  │ TokenBlacklist│            │   │
│  │  │              │  │ Model        │  │ Model        │             │   │
│  │  │ - Schema     │  │              │  │              │             │   │
│  │  │ - Platform   │  │ - Schema     │  │ - Schema     │             │   │
│  │  │   grouping   │  │ - Price      │  │ - TTL index  │             │   │
│  │  │ - References │  │   tracking   │  │ - Auto expiry│             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                  ↓                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Utility Layer                                 │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐                │   │
│  │  │ JWT Utility          │  │ Email Utility        │                │   │
│  │  │ [jwt.js]             │  │ [sendEmail.js]       │                │   │
│  │  │                      │  │                      │                │   │
│  │  │ - generateToken()    │  │ - sendEmail()        │                │   │
│  │  │   • Create JWT       │  │   • Console log      │                │   │
│  │  │   • 7-day expiry     │  │   • (Simulated)      │                │   │
│  │  │                      │  │                      │                │   │
│  │  │ - verifyToken()      │  │                      │                │   │
│  │  │   • Decode JWT       │  │                      │                │   │
│  │  │   • Verify signature │  │                      │                │   │
│  │  └──────────────────────┘  └──────────────────────┘                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
           │                        │                        │
           │                        │                        │
           ▼                        ▼                        ▼
    ┌────────────┐         ┌────────────┐         ┌────────────┐
    │  MongoDB   │         │ Gemini AI  │         │   Jumia    │
    │  Database  │         │   API      │         │  Website   │
    └────────────┘         └────────────┘         └────────────┘
```

### 4.2 Component Descriptions

#### HTTP Layer Components

**1. CORS Middleware**
- **Responsibility:** Handle cross-origin requests
- **Technology:** cors package
- **Configuration:** Allow all origins (configurable)

**2. Body Parser Middleware**
- **Responsibility:** Parse JSON and URL-encoded request bodies
- **Technology:** express.json(), express.urlencoded()
- **Limits:** Default Express limits

**3. Error Handler Middleware**
- **Responsibility:** Catch and format errors
- **Implementation:** Global error handler in app.js
- **Response Format:** `{ success: false, message: "..." }`

---

#### Route Layer Components

**7 Route Components** (one per domain):

| Component | Path | Endpoints | Middleware |
|-----------|------|-----------|-----------|
| Auth Routes | `/api/auth` | 5 | None (login/register), protect (logout) |
| Chat Routes | `/api/chat` | 4 | protect |
| Product Routes | `/api/products` | 9 | None (most), protect+authorize (refresh) |
| Cart Routes | `/api/cart` | 5 | protect |
| Wishlist Routes | `/api/wishlist` | 5 | protect |
| User Routes | `/api/users` | 3 | protect |
| Admin Routes | `/api/admin` | 4 | protect + authorize('admin') |

---

#### Security Layer Components

**1. Auth Middleware (protect)**
```javascript
Purpose: Authenticate requests
Process:
1. Extract JWT from Authorization header
2. Verify JWT signature
3. Check token not in blacklist
4. Load user from database
5. Attach user to req.user
6. Continue or reject
```

**2. Authorization Middleware (authorize)**
```javascript
Purpose: Role-based access control
Process:
1. Check req.user.role
2. Compare with allowed roles
3. Allow or deny access
```

---

#### Controller Layer Components

**7 Controller Components** (33 total functions):

**1. Auth Controller** (5 functions)
- `register()` - Create user account
- `login()` - Authenticate and issue JWT
- `logout()` - Blacklist JWT
- `forgotPassword()` - Generate reset token
- `resetPassword()` - Update password with token

**2. Chat Controller** (4 functions)
- `chat()` - Main AI chat endpoint
- `getConversationHistory()` - Retrieve single conversation
- `getUserConversations()` - List all user conversations
- `deleteConversation()` - Delete conversation

**3. Product Controller** (9 functions)
- `getAllProducts()` - List cached products with filters
- `getProductById()` - Get single product
- `getFeaturedProducts()` - Get featured products
- `searchProducts()` - Advanced search
- `searchJumiaProducts()` - Live Jumia search
- `getProductByMarketplaceId()` - Get by marketplace ID
- `refreshProductData()` - Admin: force re-scrape
- `redirectToProduct()` - Redirect to marketplace
- `compareProducts()` - Compare multiple products

**4. Cart Controller** (5 functions)
- `getCart()` - Get user's cart with platform grouping
- `addToCart()` - Add item to cart
- `updateCartItem()` - Update quantity
- `removeFromCart()` - Remove item
- `clearCart()` - Empty cart

**5. Wishlist Controller** (5 functions)
- `getWishlist()` - Get user's wishlist
- `addToWishlist()` - Add item
- `updateWishlistItem()` - Update notes/priority
- `removeFromWishlist()` - Remove item
- `clearWishlist()` - Empty wishlist

**6. User Controller** (3 functions)
- `getProfile()` - Get user profile
- `updateProfile()` - Update profile
- `changePassword()` - Change password

**7. Admin Controller** (4 functions)
- `getAllUsers()` - List all users
- `getUserById()` - Get user details
- `updateUser()` - Update user (including role)
- `deleteUser()` - Delete user

---

#### Service Layer Components

**1. AI Service Component**
```javascript
File: services/aiService.js
Class: N/A (functional)

Functions:
- processMessage(message, conversationHistory)
  Input: User message string, conversation array
  Output: { action, query, reply }
  
Dependencies:
- @google/generative-ai SDK
- Google Gemini AI API

Key Logic:
1. Initialize Gemini AI model (gemini-2.0-flash)
2. Build system instruction (structured JSON output)
3. Format conversation history
4. Send request to Gemini
5. Parse JSON response from AI
6. Extract action, query, reply
7. Fallback if parsing fails

System Instruction:
"You are an e-commerce shopping assistant... 
Output must be valid JSON with action, query, reply fields..."

Response Actions:
- "ask_question" - General conversation
- "search_products" - User wants products
```

**2. Scraping Service Component**
```javascript
File: services/jumiaService.js
Class: N/A (functional)

Functions:
- searchJumia(query, options)
  Input: Search query, { page, limit, marketplace }
  Output: Array of product objects
  
- throttleRequest()
  Purpose: Enforce 2-second delay between requests
  
- retryWithBackoff(fn, retries=3)
  Purpose: Retry failed requests with exponential backoff

Dependencies:
- axios (HTTP client)
- cheerio (HTML parser)
- Product model (caching)

Key Logic:
1. Throttle request (2s minimum gap)
2. Build Jumia search URL
3. HTTP GET with User-Agent header
4. Parse HTML with Cheerio
5. Extract product cards
6. Extract title, price, image, URL, rating
7. Cache products to MongoDB (upsert)
8. Return product array

Rate Limiting:
- 2 seconds between requests
- In-memory timestamp tracking
- 3 retry attempts with exponential backoff
```

---

#### Data Access Layer Components

**6 Model Components:**

**1. User Model**
```javascript
Schema Fields:
- name: String (required)
- email: String (unique, required, indexed)
- password: String (hashed, select: false)
- role: Enum ['user', 'admin']
- resetPasswordToken: String
- resetPasswordExpire: Date

Indexes:
- email (unique)

Middleware:
- pre('save'): Hash password with bcrypt (10 rounds)

Methods:
- comparePassword(password): Verify password
- getResetPasswordToken(): Generate reset token
```

**2. Conversation Model**
```javascript
Schema Fields:
- user: ObjectId ref 'User'
- sessionId: String (indexed)
- messages: Array [{ role, content, metadata }]
- intent: String
- context: Object { userPreferences, searchIntent }
- isActive: Boolean

Indexes:
- user + isActive (compound)
- sessionId
- lastActivity

Features:
- Conversation history tracking
- AI context persistence
- Session management
```

**3. Product Model**
```javascript
Schema Fields:
- marketplace: Enum ['jumia', 'amazon', ...]
- productId: String
- name: String (text indexed)
- description: String (text indexed)
- price: Number
- currency: String (default: 'GHS')
- category: String
- images: Array
- rating: Number (0-5)
- productUrl: String
- scrapedAt: Date

Indexes:
- {marketplace, productId} (compound unique)
- {name, description} (text search)

Features:
- Product caching
- Text search capability
- Marketplace identification
```

**4. Cart Model**
```javascript
Schema Fields:
- user: ObjectId ref 'User' (unique)
- items: Array [{
    product: ObjectId ref 'Product',
    quantity: Number (min: 1),
    price: Number,
    platform: String,
    externalUrl: String
  }]
- platformGroups: Map

Indexes:
- user (unique)

Features:
- Platform grouping for multi-marketplace carts
- Price snapshot at add time
```

**5. Wishlist Model**
```javascript
Schema Fields:
- user: ObjectId ref 'User' (unique)
- items: Array [{
    product: ObjectId ref 'Product',
    savedPrice: Number,
    priceChanged: Boolean,
    priceAlertEnabled: Boolean,
    targetPrice: Number,
    notes: String,
    priority: Enum ['low', 'medium', 'high'],
    addedAt: Date
  }]

Indexes:
- user (unique)
- items.product

Features:
- Price change tracking
- Priority levels
- Price alerts
```

**6. TokenBlacklist Model**
```javascript
Schema Fields:
- token: String (unique, indexed)
- userId: ObjectId (indexed)
- expiresAt: Date

Indexes:
- token (unique)
- userId
- expiresAt (TTL index, expireAfterSeconds: 86400)

Features:
- JWT logout mechanism
- Automatic cleanup via TTL
```

---

#### Utility Layer Components

**1. JWT Utility**
```javascript
File: utils/jwt.js

Functions:
- generateToken(userId)
  Purpose: Create JWT
  Expiry: 7 days
  Algorithm: HS256
  Secret: process.env.JWT_SECRET
  
- verifyToken(token)
  Purpose: Verify and decode JWT
  Returns: Decoded payload or throws error
```

**2. Email Utility**
```javascript
File: utils/sendEmail.js

Functions:
- sendEmail(options)
  Purpose: Send email (currently simulated)
  Implementation: console.log()
  Status: Not production-ready
  
Note: Real email service (SendGrid, AWS SES) needed for production
```

---

### 4.3 Component Interactions

**Example 1: User Login Flow**
```
1. POST /api/auth/login
2. Auth Routes → Auth Controller.login()
3. Auth Controller → User Model.findOne({ email })
4. User Model → MongoDB (query)
5. Auth Controller → User.comparePassword() (bcrypt verify)
6. Auth Controller → JWT Utility.generateToken()
7. Auth Controller → Response { token }
```

**Example 2: AI Chat with Product Search**
```
1. POST /api/chat
2. Chat Routes → Auth Middleware (verify JWT)
3. Chat Routes → Chat Controller.chat()
4. Chat Controller → Conversation Model.findOne()
5. Chat Controller → AI Service.processMessage()
6. AI Service → Gemini AI API (HTTP)
7. AI Service → Parse JSON response
8. Chat Controller → Check action === 'search_products'
9. Chat Controller → Scraping Service.searchJumia()
10. Scraping Service → Jumia website (HTTP + parse)
11. Scraping Service → Product Model.findOneAndUpdate() (cache)
12. Chat Controller → Conversation Model.save() (add message)
13. Chat Controller → Response { action, reply, recommendations }
```

---

## 5. Supporting Diagrams

### 5.1 Authentication Flow Diagram

```
┌─────────┐                                          ┌─────────────┐
│  Client │                                          │   MongoDB   │
└────┬────┘                                          └──────┬──────┘
     │                                                      │
     │ POST /api/auth/register                             │
     │ { name, email, password }                           │
     ├──────────────────────────────────────────┐          │
     │                                           │          │
     │                                           ▼          │
     │                              ┌──────────────────────┐│
     │                              │  Auth Controller     ││
     │                              │  - Hash password     ││
     │                              │  - Create user       ││
     │                              └──────────┬───────────┘│
     │                                         │            │
     │                                         │ user.save()│
     │                                         ├────────────▶
     │                                         │            │
     │                                         │ ◀──────────┤
     │                                         │  (user doc)│
     │                                         │            │
     │                                         ▼            │
     │                              ┌──────────────────────┐│
     │                              │  JWT Utility         ││
     │                              │  generateToken()     ││
     │                              └──────────┬───────────┘│
     │ ◀────────────────────────────────────────┘          │
     │ 201 { success: true, token: "..." }                 │
     │                                                      │
     ├─ Store token in localStorage ─┐                     │
     │                                │                     │
     │                                │                     │
     │ POST /api/chat                 │                     │
     │ Authorization: Bearer <token>  │                     │
     ├────────────────────────────────┼───────────────────┐ │
     │                                │                   │ │
     │                                ▼                   ▼ │
     │                    ┌──────────────────────────────┐  │
     │                    │  Auth Middleware             │  │
     │                    │  1. Extract token            │  │
     │                    │  2. Verify JWT signature     │  │
     │                    │  3. Check token blacklist────├──▶
     │                    │  4. Load user from DB────────├──▶
     │                    │  5. Attach to req.user       │  │
     │                    └──────────┬───────────────────┘  │
     │                               │                      │
     │                               ▼                      │
     │                    ┌──────────────────────────────┐  │
     │                    │  Chat Controller             │  │
     │                    │  req.user available          │  │
     │                    └──────────────────────────────┘  │
     │                                                       │
```

### 5.2 Data Dependency Diagram

```
┌──────────────────────────────────────────────────────────┐
│                  Data Dependencies                        │
└──────────────────────────────────────────────────────────┘

  User                    Conversation              Product
┌──────┐                 ┌──────────┐             ┌──────┐
│ _id  │◀────references──│ user     │             │ _id  │
│ email│                 │ sessionId│             │ name │
│ role │                 │ messages │             │ price│
└──────┘                 └──────────┘             └──────┘
   ▲                                                  ▲
   │                                                  │
   │                                                  │
   │ references                              references
   │                                                  │
   │        Cart                  Wishlist            │
   │      ┌──────┐              ┌──────────┐         │
   └──────│ user │              │ user     │─────────┘
          │items │◀─references──│ items[]  │
          │  [   │              │   [      │
          │   { product }       │    { product }
          │  ]   │              │   ]      │
          └──────┘              └──────────┘


  TokenBlacklist
┌────────────┐
│ token      │
│ userId     │◀──references── User._id
│ expiresAt  │
└────────────┘
```

### 5.3 Deployment Diagram (Recommended)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Cloud Provider (AWS/GCP/Azure)          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Load Balancer                         │  │
│  │                  (Nginx / ALB / Cloud LB)               │  │
│  └────────────┬──────────────────┬──────────────────────────┘  │
│               │                  │                             │
│  ┌────────────▼─────┐  ┌─────────▼────────┐  ┌──────────────┐ │
│  │  Server Instance  │  │ Server Instance  │  │   Auto-Scale  │ │
│  │  (Node.js App)   │  │  (Node.js App)   │  │   Group       │ │
│  │  Port: 5000      │  │  Port: 5000      │  │               │ │
│  └────────┬─────────┘  └─────────┬────────┘  └──────────────┘ │
│           │                      │                             │
└───────────┼──────────────────────┼─────────────────────────────┘
            │                      │
            │                      │
    ┌───────┴──────────────────────┴────────┐
    │                                        │
    │  ┌──────────────────────────────────┐ │
    │  │      MongoDB Atlas Cluster       │ │
    │  │      (Database as a Service)     │ │
    │  │                                  │ │
    │  │  ┌─────────┐  ┌─────────┐       │ │
    │  │  │ Primary │  │ Secondary│       │ │
    │  │  │  Node   │  │  Nodes   │       │ │
    │  │  └─────────┘  └─────────┘       │ │
    │  └──────────────────────────────────┘ │
    │                                        │
    │  ┌──────────────────────────────────┐ │
    │  │      Redis Cache (Optional)      │ │
    │  │      - Token blacklist           │ │
    │  │      - Session data              │ │
    │  │      - Product cache             │ │
    │  └──────────────────────────────────┘ │
    │                                        │
    └────────────────────────────────────────┘

External Services:
┌─────────────────┐  ┌─────────────────┐
│  Gemini AI API  │  │  Jumia Website  │
│  (Google Cloud) │  │  (External)     │
└─────────────────┘  └─────────────────┘
```

---

## Summary

### Key Architectural Insights

**Layered Architecture:**
- Clear separation: Routes → Controllers → Services → Models
- Middleware for cross-cutting concerns
- Utilities for shared functions

**Stateless Design:**
- JWT authentication enables horizontal scaling
- No server-side session storage
- Database connection pooling

**External Integrations:**
- AI service for natural language processing
- Web scraping for real-time product data
- Caching strategy to minimize external calls

**Data Management:**
- MongoDB for flexible schema
- Indexes for performance
- TTL indexes for automatic cleanup
- References between collections

**Security:**
- JWT with blacklist
- Role-based access control
- Password hashing (bcrypt)
- Input validation at multiple layers

---

**Document Status:** ✅ Complete  
**Last Updated:** December 2, 2025  
**C4 Model Version:** 1.0
