# Complete API Documentation
**E-Commerce Chat Assistant Backend**

**Version:** 1.0.0  
**Date:** December 2, 2025  
**Base URL:** `http://localhost:5000`

---

## Table of Contents
1. [API Overview](#1-api-overview)
2. [Authentication](#2-authentication)
3. [Authentication Endpoints](#3-authentication-endpoints)
4. [Chat Endpoints](#4-chat-endpoints)
5. [Product Endpoints](#5-product-endpoints)
6. [Cart Endpoints](#6-cart-endpoints)
7. [Wishlist Endpoints](#7-wishlist-endpoints)
8. [User Profile Endpoints](#8-user-profile-endpoints)
9. [Admin Endpoints](#9-admin-endpoints)
10. [Error Handling](#10-error-handling)
11. [Rate Limiting](#11-rate-limiting)

---

## 1. API Overview

### 1.1 General Information

**Protocol:** HTTP/HTTPS  
**Data Format:** JSON  
**Authentication:** JWT Bearer Token  
**Character Encoding:** UTF-8

### 1.2 Base URL

```
Development: http://localhost:5000
Production: https://api.yourdomain.com
```

### 1.3 API Groups

| Group | Base Path | Endpoints | Authentication |
|-------|-----------|-----------|----------------|
| Authentication | `/api/auth` | 5 | Mixed |
| Chat | `/api/chat` | 4 | Required |
| Products | `/api/products` | 9 | Mixed |
| Cart | `/api/cart` | 5 | Required |
| Wishlist | `/api/wishlist` | 5 | Required |
| User Profile | `/api/users` | 3 | Required |
| Admin | `/api/admin` | 4 | Required (Admin) |

**Total Endpoints:** 33

### 1.4 Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 2. Authentication

### 2.1 Authentication Method

**Type:** JWT (JSON Web Token)  
**Header:** `Authorization: Bearer <token>`  
**Token Expiry:** 7 days  
**Algorithm:** HS256

### 2.2 Obtaining a Token

```bash
# Register or Login to get token
POST /api/auth/register
POST /api/auth/login
```

### 2.3 Using the Token

Include in request headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.4 Token Payload

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1701518400,
  "exp": 1702123200
}
```

---

## 3. Authentication Endpoints

### 3.1 Register User

**Endpoint:** `POST /api/auth/register`  
**Authentication:** None  
**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing or invalid fields
- `409 Conflict` - Email already exists

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 3.2 Login User

**Endpoint:** `POST /api/auth/login`  
**Authentication:** None  
**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing credentials
- `401 Unauthorized` - Invalid credentials

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 3.3 Logout User

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required  
**Description:** Invalidate JWT token (add to blacklist)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3.4 Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`  
**Authentication:** None  
**Description:** Request password reset token

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": {
    "resetToken": "a1b2c3d4e5f6g7h8i9j0"
  }
}
```

**Note:** In production, token should be sent via email, not in response.

**Error Responses:**
- `404 Not Found` - Email not found

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

---

### 3.5 Reset Password

**Endpoint:** `PUT /api/auth/reset-password/:token`  
**Authentication:** None (uses reset token)  
**Description:** Reset password using reset token

**URL Parameters:**
- `token` (string) - Reset token from forgot password

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid or expired token
- `400 Bad Request` - Password too short

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/auth/reset-password/a1b2c3d4e5f6g7h8i9j0 \
  -H "Content-Type: application/json" \
  -d '{"password": "newPassword123"}'
```

---

## 4. Chat Endpoints

### 4.1 Send Chat Message

**Endpoint:** `POST /api/chat`  
**Authentication:** Required  
**Description:** Send message to AI assistant and get response with product recommendations

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "message": "I need a gaming laptop under 5000 GHS",
  "sessionId": "chat_abc123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "action": "search_products",
    "reply": "I found some great gaming laptops within your budget! Here are my top recommendations:",
    "recommendations": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "name": "HP Pavilion Gaming Laptop",
        "price": 4500,
        "currency": "GHS",
        "marketplace": "jumia",
        "images": ["https://jumia.com.gh/images/hp-gaming.jpg"],
        "rating": 4.5,
        "productUrl": "https://www.jumia.com.gh/hp-pavilion-gaming"
      }
    ],
    "conversation": {
      "_id": "507f1f77bcf86cd799439012",
      "sessionId": "chat_abc123",
      "messages": [
        {
          "role": "user",
          "content": "I need a gaming laptop under 5000 GHS",
          "timestamp": "2025-12-02T10:00:00.000Z"
        },
        {
          "role": "model",
          "content": "I found some great gaming laptops...",
          "timestamp": "2025-12-02T10:00:03.000Z"
        }
      ]
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing message or sessionId
- `401 Unauthorized` - Invalid token
- `500 Internal Server Error` - AI service error

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a gaming laptop under 5000 GHS",
    "sessionId": "chat_abc123"
  }'
```

---

### 4.2 Get Conversation History

**Endpoint:** `GET /api/chat/conversations/:sessionId`  
**Authentication:** Required  
**Description:** Retrieve specific conversation by session ID

**URL Parameters:**
- `sessionId` (string) - Conversation session identifier

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "sessionId": "chat_abc123",
    "messages": [
      {
        "role": "user",
        "content": "I need a gaming laptop",
        "timestamp": "2025-12-02T10:00:00.000Z"
      },
      {
        "role": "model",
        "content": "I can help you find gaming laptops!",
        "timestamp": "2025-12-02T10:00:02.000Z",
        "suggestedProducts": ["507f1f77bcf86cd799439020"]
      }
    ],
    "intent": "product_search",
    "createdAt": "2025-12-02T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Conversation not found

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/chat/conversations/chat_abc123 \
  -H "Authorization: Bearer <token>"
```

---

### 4.3 Get All User Conversations

**Endpoint:** `GET /api/chat/conversations`  
**Authentication:** Required  
**Description:** List all conversations for authenticated user

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "sessionId": "chat_abc123",
        "lastMessage": "I found some great gaming laptops...",
        "intent": "product_search",
        "messageCount": 8,
        "lastActivity": "2025-12-02T10:00:00.000Z",
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/chat/conversations?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### 4.4 Delete Conversation

**Endpoint:** `DELETE /api/chat/conversations/:sessionId`  
**Authentication:** Required  
**Description:** Delete specific conversation

**URL Parameters:**
- `sessionId` (string) - Conversation session identifier

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

**Error Responses:**
- `404 Not Found` - Conversation not found
- `403 Forbidden` - Not conversation owner

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/chat/conversations/chat_abc123 \
  -H "Authorization: Bearer <token>"
```

---

## 5. Product Endpoints

### 5.1 Get All Products

**Endpoint:** `GET /api/products`  
**Authentication:** Optional  
**Description:** List all cached products with filtering, sorting, and pagination

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20, max: 100)
- `category` (string) - Filter by category
- `marketplace` (string) - Filter by marketplace (jumia, amazon, etc.)
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `sortBy` (string) - Sort field (price, rating, name, createdAt)
- `order` (string) - Sort order (asc, desc)
- `featured` (boolean) - Filter featured products

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "marketplace": "jumia",
        "productId": "hp-pavilion-gaming-12345",
        "name": "HP Pavilion Gaming Laptop",
        "price": 4500,
        "currency": "GHS",
        "category": "Electronics",
        "images": ["https://jumia.com.gh/images/hp-gaming.jpg"],
        "rating": 4.5,
        "numReviews": 127,
        "productUrl": "https://www.jumia.com.gh/hp-pavilion-gaming",
        "featured": false,
        "scrapedAt": "2025-12-02T09:45:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 98,
      "itemsPerPage": 20
    },
    "filters": {
      "category": "Electronics",
      "priceRange": {
        "min": 0,
        "max": 5000
      }
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/products?category=Electronics&minPrice=1000&maxPrice=5000&sortBy=price&order=asc&page=1&limit=20"
```

---

### 5.2 Get Product by ID

**Endpoint:** `GET /api/products/:id`  
**Authentication:** Optional  
**Description:** Get single product details

**URL Parameters:**
- `id` (string) - MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "marketplace": "jumia",
    "productId": "hp-pavilion-gaming-12345",
    "name": "HP Pavilion Gaming Laptop - 15.6\" FHD",
    "description": "Powerful gaming laptop with GTX 1650 graphics card, Intel Core i5 processor, 8GB RAM, 512GB SSD",
    "price": 4500,
    "currency": "GHS",
    "category": "Electronics",
    "images": [
      "https://jumia.com.gh/images/hp-gaming-1.jpg",
      "https://jumia.com.gh/images/hp-gaming-2.jpg"
    ],
    "rating": 4.5,
    "numReviews": 127,
    "productUrl": "https://www.jumia.com.gh/hp-pavilion-gaming",
    "tags": ["gaming", "laptop", "hp", "gtx"],
    "scrapedAt": "2025-12-02T09:45:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Product not found

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/products/507f1f77bcf86cd799439020
```

---

### 5.3 Search Products

**Endpoint:** `GET /api/products/search`  
**Authentication:** Optional  
**Description:** Full-text search across product names and descriptions

**Query Parameters:**
- `q` (string, required) - Search query
- `category` (string) - Filter by category
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `page` (number) - Page number
- `limit` (number) - Items per page

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "name": "HP Pavilion Gaming Laptop",
        "price": 4500,
        "marketplace": "jumia",
        "images": ["https://jumia.com.gh/images/hp-gaming.jpg"],
        "rating": 4.5,
        "score": 2.85
      }
    ],
    "searchQuery": "gaming laptop",
    "totalResults": 15,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "itemsPerPage": 20
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/products/search?q=gaming+laptop&minPrice=3000&maxPrice=6000"
```

---

### 5.4 Get Featured Products

**Endpoint:** `GET /api/products/featured`  
**Authentication:** Optional  
**Description:** Get list of featured products

**Query Parameters:**
- `limit` (number) - Max items (default: 10)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439021",
        "name": "Samsung Galaxy S24",
        "price": 3500,
        "currency": "GHS",
        "marketplace": "jumia",
        "images": ["https://jumia.com.gh/images/samsung-s24.jpg"],
        "rating": 4.8,
        "featured": true
      }
    ],
    "count": 8
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/products/featured?limit=10"
```

---

### 5.5 Search Jumia Products (Live)

**Endpoint:** `GET /api/products/jumia/search`  
**Authentication:** Optional  
**Description:** Real-time web scraping of Jumia Ghana

**Query Parameters:**
- `query` (string, required) - Search term
- `page` (number) - Jumia page number (default: 1)
- `limit` (number) - Results per page (default: 20)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439025",
        "marketplace": "jumia",
        "productId": "new-laptop-xyz",
        "name": "Dell Inspiron 15",
        "price": 3800,
        "currency": "GHS",
        "images": ["https://jumia.com.gh/images/dell-inspiron.jpg"],
        "productUrl": "https://www.jumia.com.gh/dell-inspiron",
        "rating": 4.3,
        "numReviews": 89,
        "scrapedAt": "2025-12-02T10:30:00.000Z"
      }
    ],
    "searchQuery": "laptop",
    "totalFound": 45,
    "scrapedAt": "2025-12-02T10:30:00.000Z"
  }
}
```

**Note:** This endpoint may take 3-8 seconds due to web scraping and throttling.

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/products/jumia/search?query=laptop&page=1&limit=20"
```

---

### 5.6 Get Product by Marketplace ID

**Endpoint:** `GET /api/products/:marketplace/:productId`  
**Authentication:** Optional  
**Description:** Get product by marketplace and external product ID

**URL Parameters:**
- `marketplace` (string) - Marketplace name (jumia, amazon, etc.)
- `productId` (string) - External product identifier

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "marketplace": "jumia",
    "productId": "hp-pavilion-gaming-12345",
    "name": "HP Pavilion Gaming Laptop",
    "price": 4500,
    "currency": "GHS"
  }
}
```

**Error Responses:**
- `404 Not Found` - Product not found

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/products/jumia/hp-pavilion-gaming-12345
```

---

### 5.7 Refresh Product Data (Admin)

**Endpoint:** `POST /api/products/refresh/:marketplace/:productId`  
**Authentication:** Required (Admin only)  
**Description:** Force re-scrape product data from marketplace

**URL Parameters:**
- `marketplace` (string) - Marketplace name
- `productId` (string) - External product identifier

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product data refreshed successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "HP Pavilion Gaming Laptop",
    "price": 4300,
    "priceChanged": true,
    "oldPrice": 4500,
    "scrapedAt": "2025-12-02T10:45:00.000Z"
  }
}
```

**Error Responses:**
- `403 Forbidden` - Not admin user
- `404 Not Found` - Product not found on marketplace

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/products/refresh/jumia/hp-pavilion-gaming-12345 \
  -H "Authorization: Bearer <admin-token>"
```

---

### 5.8 Redirect to Product

**Endpoint:** `GET /api/products/redirect/:marketplace/:productId`  
**Authentication:** Optional  
**Description:** Redirect to external marketplace product page

**URL Parameters:**
- `marketplace` (string) - Marketplace name
- `productId` (string) - External product identifier

**Success Response (302 Redirect):**
Redirects to: `https://www.jumia.com.gh/product-page`

**cURL Example:**
```bash
curl -L http://localhost:5000/api/products/redirect/jumia/hp-pavilion-gaming-12345
```

---

### 5.9 Compare Products

**Endpoint:** `POST /api/products/compare`  
**Authentication:** Optional  
**Description:** Compare multiple products side-by-side

**Request Body:**
```json
{
  "productIds": [
    "507f1f77bcf86cd799439020",
    "507f1f77bcf86cd799439021",
    "507f1f77bcf86cd799439022"
  ]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "comparison": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "name": "HP Pavilion Gaming",
        "price": 4500,
        "rating": 4.5,
        "marketplace": "jumia"
      },
      {
        "_id": "507f1f77bcf86cd799439021",
        "name": "Dell Inspiron 15",
        "price": 3800,
        "rating": 4.3,
        "marketplace": "jumia"
      }
    ],
    "summary": {
      "lowestPrice": 3800,
      "highestPrice": 4500,
      "averagePrice": 4150,
      "highestRated": "507f1f77bcf86cd799439020"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/products/compare \
  -H "Content-Type: application/json" \
  -d '{
    "productIds": ["507f1f77bcf86cd799439020", "507f1f77bcf86cd799439021"]
  }'
```

---

## 6. Cart Endpoints

### 6.1 Get Cart

**Endpoint:** `GET /api/cart`  
**Authentication:** Required  
**Description:** Retrieve user's shopping cart with platform grouping

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "item1",
        "product": {
          "_id": "507f1f77bcf86cd799439020",
          "name": "HP Pavilion Gaming Laptop",
          "images": ["https://jumia.com.gh/images/hp-gaming.jpg"],
          "marketplace": "jumia"
        },
        "quantity": 1,
        "price": 4500,
        "platform": "jumia",
        "externalUrl": "https://www.jumia.com.gh/hp-pavilion-gaming",
        "subtotal": 4500
      }
    ],
    "platformGroups": {
      "jumia": [
        {
          "product": "507f1f77bcf86cd799439020",
          "quantity": 1
        }
      ]
    },
    "totalPrice": 4500,
    "itemCount": 1
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer <token>"
```

---

### 6.2 Add to Cart

**Endpoint:** `POST /api/cart/add`  
**Authentication:** Required  
**Description:** Add product to shopping cart

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439020",
  "quantity": 1
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "cart": {
      "_id": "507f1f77bcf86cd799439030",
      "items": [
        {
          "product": "507f1f77bcf86cd799439020",
          "quantity": 1,
          "price": 4500
        }
      ],
      "totalPrice": 4500,
      "itemCount": 1
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing productId or quantity
- `404 Not Found` - Product not found
- `409 Conflict` - Product already in cart (use update instead)

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439020",
    "quantity": 1
  }'
```

---

### 6.3 Update Cart Item

**Endpoint:** `PUT /api/cart/update/:itemId`  
**Authentication:** Required  
**Description:** Update quantity of cart item

**URL Parameters:**
- `itemId` (string) - Cart item ID (subdocument _id)

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "cart": {
      "_id": "507f1f77bcf86cd799439030",
      "items": [
        {
          "_id": "item1",
          "quantity": 3,
          "price": 4500,
          "subtotal": 13500
        }
      ],
      "totalPrice": 13500
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid quantity (< 1)
- `404 Not Found` - Cart item not found

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/cart/update/item1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

---

### 6.4 Remove from Cart

**Endpoint:** `DELETE /api/cart/remove/:itemId`  
**Authentication:** Required  
**Description:** Remove specific item from cart

**URL Parameters:**
- `itemId` (string) - Cart item ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cart": {
      "_id": "507f1f77bcf86cd799439030",
      "items": [],
      "totalPrice": 0,
      "itemCount": 0
    }
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/cart/remove/item1 \
  -H "Authorization: Bearer <token>"
```

---

### 6.5 Clear Cart

**Endpoint:** `DELETE /api/cart/clear`  
**Authentication:** Required  
**Description:** Empty entire shopping cart

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "cart": {
      "_id": "507f1f77bcf86cd799439030",
      "items": [],
      "totalPrice": 0,
      "itemCount": 0
    }
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/cart/clear \
  -H "Authorization: Bearer <token>"
```

---

## 7. Wishlist Endpoints

### 7.1 Get Wishlist

**Endpoint:** `GET /api/wishlist`  
**Authentication:** Required  
**Description:** Retrieve user's wishlist with price change tracking

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439040",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "wishitem1",
        "product": {
          "_id": "507f1f77bcf86cd799439022",
          "name": "Gaming Monitor 27\"",
          "price": 2300,
          "images": ["https://jumia.com.gh/images/monitor.jpg"]
        },
        "savedPrice": 2500,
        "currentPrice": 2300,
        "priceChanged": true,
        "priceDifference": -200,
        "priceChangePercentage": -8,
        "priceAlertEnabled": true,
        "targetPrice": 2000,
        "notes": "Wait for Black Friday",
        "priority": "high",
        "addedAt": "2025-11-15T08:00:00.000Z"
      }
    ],
    "collections": {
      "Electronics": [
        {
          "product": "507f1f77bcf86cd799439022",
          "name": "Gaming Monitor 27\""
        }
      ]
    },
    "summary": {
      "totalItems": 5,
      "priceDrops": 2,
      "priceIncreases": 1
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer <token>"
```

---

### 7.2 Add to Wishlist

**Endpoint:** `POST /api/wishlist`  
**Authentication:** Required  
**Description:** Add product to wishlist

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439022",
  "notes": "Wait for sale",
  "priority": "high",
  "targetPrice": 2000,
  "priceAlertEnabled": true
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "data": {
    "wishlist": {
      "_id": "507f1f77bcf86cd799439040",
      "items": [
        {
          "product": "507f1f77bcf86cd799439022",
          "savedPrice": 2500,
          "priority": "high",
          "notes": "Wait for sale",
          "targetPrice": 2000,
          "priceAlertEnabled": true,
          "addedAt": "2025-12-02T10:50:00.000Z"
        }
      ]
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing productId
- `404 Not Found` - Product not found
- `409 Conflict` - Product already in wishlist

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439022",
    "notes": "Wait for sale",
    "priority": "high",
    "targetPrice": 2000,
    "priceAlertEnabled": true
  }'
```

---

### 7.3 Update Wishlist Item

**Endpoint:** `PUT /api/wishlist/:itemId`  
**Authentication:** Required  
**Description:** Update wishlist item properties

**URL Parameters:**
- `itemId` (string) - Wishlist item ID

**Request Body:**
```json
{
  "notes": "Buy this month",
  "priority": "medium",
  "targetPrice": 2200,
  "priceAlertEnabled": false
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Wishlist item updated",
  "data": {
    "item": {
      "_id": "wishitem1",
      "notes": "Buy this month",
      "priority": "medium",
      "targetPrice": 2200,
      "priceAlertEnabled": false
    }
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/wishlist/wishitem1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Buy this month",
    "priority": "medium"
  }'
```

---

### 7.4 Remove from Wishlist

**Endpoint:** `DELETE /api/wishlist/:itemId`  
**Authentication:** Required  
**Description:** Remove item from wishlist

**URL Parameters:**
- `itemId` (string) - Wishlist item ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/wishlist/wishitem1 \
  -H "Authorization: Bearer <token>"
```

---

### 7.5 Clear Wishlist

**Endpoint:** `DELETE /api/wishlist`  
**Authentication:** Required  
**Description:** Empty entire wishlist

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Wishlist cleared successfully",
  "data": {
    "wishlist": {
      "_id": "507f1f77bcf86cd799439040",
      "items": []
    }
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer <token>"
```

---

## 8. User Profile Endpoints

### 8.1 Get Profile

**Endpoint:** `GET /api/users/profile`  
**Authentication:** Required  
**Description:** Get authenticated user's profile

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <token>"
```

---

### 8.2 Update Profile

**Endpoint:** `PUT /api/users/profile`  
**Authentication:** Required  
**Description:** Update user profile information

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
}
```

**Error Responses:**
- `409 Conflict` - Email already taken

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

---

### 8.3 Change Password

**Endpoint:** `PUT /api/users/change-password`  
**Authentication:** Required  
**Description:** Change user password

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Current password incorrect
- `400 Bad Request` - New password too short

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/users/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
  }'
```

---

## 9. Admin Endpoints

### 9.1 Get All Users

**Endpoint:** `GET /api/admin/users`  
**Authentication:** Required (Admin only)  
**Description:** List all users (admin only)

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `role` (string) - Filter by role (user, admin)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 123
    }
  }
}
```

**Error Responses:**
- `403 Forbidden` - Not admin user

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer <admin-token>"
```

---

### 9.2 Get User by ID

**Endpoint:** `GET /api/admin/users/:id`  
**Authentication:** Required (Admin only)  
**Description:** Get specific user details

**URL Parameters:**
- `id` (string) - User MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "stats": {
        "conversationCount": 15,
        "cartItemCount": 3,
        "wishlistItemCount": 8
      }
    }
  }
}
```

**Error Responses:**
- `403 Forbidden` - Not admin user
- `404 Not Found` - User not found

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>"
```

---

### 9.3 Update User

**Endpoint:** `PUT /api/admin/users/:id`  
**Authentication:** Required (Admin only)  
**Description:** Update user details including role

**URL Parameters:**
- `id` (string) - User MongoDB ObjectId

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "role": "admin"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Updated Name",
      "email": "newemail@example.com",
      "role": "admin"
    }
  }
}
```

**Error Responses:**
- `403 Forbidden` - Not admin user
- `404 Not Found` - User not found

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "role": "admin"
  }'
```

---

### 9.4 Delete User

**Endpoint:** `DELETE /api/admin/users/:id`  
**Authentication:** Required (Admin only)  
**Description:** Delete user account

**URL Parameters:**
- `id` (string) - User MongoDB ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden` - Not admin user
- `404 Not Found` - User not found
- `400 Bad Request` - Cannot delete yourself

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>"
```

---

## 10. Error Handling

### 10.1 Standard Error Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (development only)"
}
```

### 10.2 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation failure |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 500 | Internal Server Error | Server-side error |

### 10.3 Common Error Examples

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error",
  "error": "Database connection failed"
}
```

---

## 11. Rate Limiting

### 11.1 Web Scraping Rate Limits

**Jumia Search:**
- Throttle: 2 seconds between requests
- Retry: 3 attempts with exponential backoff
- Timeout: 10 seconds per request

### 11.2 AI Service Rate Limits

**Gemini AI:**
- Provider limit: 60 requests per minute
- No application-level rate limiting implemented

### 11.3 Recommendations

**Future Implementation:**
- API rate limiting per user/IP
- Request throttling middleware
- Caching layer (Redis)
- Circuit breaker for external services

---

## Summary

### API Statistics

**Total Endpoints:** 33  
**Authentication Required:** 24 endpoints  
**Public Endpoints:** 9 endpoints  
**Admin-Only Endpoints:** 5 endpoints

**Endpoint Breakdown:**
- Authentication: 5 endpoints
- Chat (AI): 4 endpoints
- Products: 9 endpoints
- Cart: 5 endpoints
- Wishlist: 5 endpoints
- User Profile: 3 endpoints
- Admin: 4 endpoints

**Response Time Targets:**
- Authentication: < 100ms
- Product queries: < 100ms
- Cart/Wishlist: < 50ms
- AI chat: 1-3 seconds
- Live scraping: 3-8 seconds

---

**Document Status:** ✅ Complete  
**Last Updated:** December 2, 2025  
**API Version:** 1.0.0
