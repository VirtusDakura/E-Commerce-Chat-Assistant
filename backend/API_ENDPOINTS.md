# 🔗 API Endpoints Reference# 🔗 API Endpoints Quick Reference



Complete API documentation for the E-Commerce Chat Assistant backend.## Base URL

```

**Base URL:** `http://localhost:5000`http://localhost:5000

```

---

---

## 📑 Quick Navigation

## 🔐 Authentication Endpoints

| Category | Endpoints |**Base Path**: `/api/auth`

|----------|-----------|

| [Authentication](#authentication) | Register, Login, Logout, Password Reset || Method | Endpoint | Auth Required | Description |

| [User Management](#user-management) | Profile, Change Password ||--------|----------|---------------|-------------|

| [Chat (Gemini AI)](#chat-gemini-ai) | Send Message, Conversations || POST | `/api/auth/register` | ❌ No | Register new user |

| [Products](#products) | Search, Get Details, Refresh Data || POST | `/api/auth/login` | ❌ No | Login user |

| [Shopping Cart](#shopping-cart) | View, Add, Update, Remove || POST | `/api/auth/logout` | ✅ Yes | Logout user (invalidate token) |

| [Wishlist](#wishlist) | View, Add, Remove || POST | `/api/auth/forgot-password` | ❌ No | Request password reset |

| [Admin](#admin) | User Management, Statistics || PUT | `/api/auth/reset-password/:token` | ❌ No | Reset password with token |



------



## 🔐 Authentication## 👤 User Endpoints

**Base Path**: `/api/users`

### Register New User

| Method | Endpoint | Auth Required | Description |

**POST** `/api/auth/register`  |--------|----------|---------------|-------------|

**Auth:** ❌ No| GET | `/api/users/profile` | ✅ Yes | Get current user profile |

| PUT | `/api/users/profile` | ✅ Yes | Update user profile |

**Request:**| PUT | `/api/users/change-password` | ✅ Yes | Change password |

```json

{---

  "name": "John Doe",

  "email": "john@example.com",## 💬 Chat Endpoints (Gemini AI)

  "password": "securePassword123"**Base Path**: `/api/chat`

}

```| Method | Endpoint | Auth Required | Description |

|--------|----------|---------------|-------------|

**Response (201):**| POST | `/api/chat` | ✅ Yes | Send message to AI (main chat) |

```json| GET | `/api/chat/conversations` | ✅ Yes | List all user conversations |

{| GET | `/api/chat/conversations/:sessionId` | ✅ Yes | Get conversation history |

  "success": true,| DELETE | `/api/chat/conversations/:sessionId` | ✅ Yes | Delete conversation |

  "message": "User registered successfully",

  "data": {---

    "user": {

      "_id": "674a...",## 🛍️ Product Endpoints

      "name": "John Doe",**Base Path**: `/api/products`

      "email": "john@example.com",

      "role": "user"| Method | Endpoint | Auth Required | Description |

    },|--------|----------|---------------|-------------|

    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."| GET | `/api/products` | ✅ Yes | Get all products (with filters) |

  }| GET | `/api/products/search` | ✅ Yes | Search products |

}| GET | `/api/products/featured` | ✅ Yes | Get featured products |

```| GET | `/api/products/compare` | ✅ Yes | Compare products |

| GET | `/api/products/jumia/search` | ✅ Yes | Search Jumia Ghana products |

---| GET | `/api/products/:marketplace/:productId` | ✅ Yes | Get product by marketplace ID |

| GET | `/api/products/redirect/:marketplace/:productId` | ✅ Yes | Redirect to product (tracks click) |

### Login| POST | `/api/products/refresh/:marketplace/:productId` | ✅ Yes (Admin) | Refresh product data |



**POST** `/api/auth/login`  ---

**Auth:** ❌ No

## 🛒 Cart Endpoints

**Request:****Base Path**: `/api/cart`

```json

{| Method | Endpoint | Auth Required | Description |

  "email": "john@example.com",|--------|----------|---------------|-------------|

  "password": "securePassword123"| GET | `/api/cart` | ✅ Yes | Get user cart |

}| POST | `/api/cart/add` | ✅ Yes | Add product to cart |

```| PUT | `/api/cart/update/:itemId` | ✅ Yes | Update cart item quantity |

| DELETE | `/api/cart/remove/:itemId` | ✅ Yes | Remove item from cart |

**Response (200):**| DELETE | `/api/cart/clear` | ✅ Yes | Clear entire cart |

```json

{---

  "success": true,

  "message": "Login successful",## ❤️ Wishlist Endpoints

  "data": {**Base Path**: `/api/wishlist`

    "user": {

      "_id": "674a...",| Method | Endpoint | Auth Required | Description |

      "name": "John Doe",|--------|----------|---------------|-------------|

      "email": "john@example.com",| GET | `/api/wishlist` | ✅ Yes | Get user wishlist |

      "role": "user"| POST | `/api/wishlist` | ✅ Yes | Add product to wishlist |

    },| DELETE | `/api/wishlist/:itemId` | ✅ Yes | Remove item from wishlist |

    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."| DELETE | `/api/wishlist` | ✅ Yes | Clear entire wishlist |

  }

}---

```

## 👨‍💼 Admin Endpoints

---**Base Path**: `/api/admin`



### Logout| Method | Endpoint | Auth Required | Description |

|--------|----------|---------------|-------------|

**POST** `/api/auth/logout`  | GET | `/api/admin/users` | ✅ Yes (Admin) | Get all users |

**Auth:** ✅ Yes| GET | `/api/admin/users/:id` | ✅ Yes (Admin) | Get user by ID |

| PUT | `/api/admin/users/:id` | ✅ Yes (Admin) | Update user |

**Headers:**| DELETE | `/api/admin/users/:id` | ✅ Yes (Admin) | Delete user |

```| GET | `/api/admin/stats` | ✅ Yes (Admin) | Get dashboard statistics |

Authorization: Bearer YOUR_JWT_TOKEN

```---



**Response (200):**## 🔑 Authentication Header Format

```json

{For all protected endpoints (✅ Yes), include this header:

  "success": true,

  "message": "Logged out successfully"```

}Authorization: Bearer YOUR_JWT_TOKEN_HERE

``````



**Note:** Invalidates the JWT token by adding it to the blacklist.**Example**:

```

---Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

```

### Forgot Password

---

**POST** `/api/auth/forgot-password`  

**Auth:** ❌ No## 📝 Common Query Parameters



**Request:**### Pagination

```json```

{?page=1&limit=20

  "email": "john@example.com"```

}

```### Product Filters

```

**Response (200):**?category=Electronics&minPrice=1000&maxPrice=5000

```json```

{

  "success": true,### Search

  "message": "Password reset email sent"```

}?q=laptop

``````



---### Sort

```

### Reset Password?sortBy=price&order=asc

```

**PUT** `/api/auth/reset-password/:token`  

**Auth:** ❌ No---



**Parameters:**## ⚠️ Common Mistakes

- `token` - Reset token from email

### ❌ WRONG: `/api/auth/profile`

**Request:**### ✅ CORRECT: `/api/users/profile`

```json

{The profile endpoint is under `/api/users`, not `/api/auth`!

  "password": "newSecurePassword123"

}### ❌ WRONG: Missing `Bearer` prefix

``````

Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

**Response (200):**```

```json

{### ✅ CORRECT: Include `Bearer` prefix

  "success": true,```

  "message": "Password reset successful"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

}```

```

---

---

## 🎯 Testing Order

## 👤 User Management

1. **Register** → `/api/auth/register`

### Get Profile2. **Login** → `/api/auth/login` (save token)

3. **Get Profile** → `/api/users/profile` (use token)

**GET** `/api/users/profile`  4. **Chat** → `/api/chat` (send message)

**Auth:** ✅ Yes5. **Search Products** → `/api/products/jumia/search`

6. **Add to Cart** → `/api/cart`

**Response (200):**7. **Add to Wishlist** → `/api/wishlist`

```json

{---

  "success": true,

  "data": {## 📊 Response Format

    "_id": "674a...",

    "name": "John Doe",### Success Response

    "email": "john@example.com",```json

    "role": "user",{

    "createdAt": "2025-11-28T12:00:00.000Z"  "success": true,

  }  "message": "Operation successful",

}  "data": {...}

```}

```

---

### Error Response

### Update Profile```json

{

**PUT** `/api/users/profile`    "success": false,

**Auth:** ✅ Yes  "message": "Error description",

  "error": "Details (in development mode)"

**Request:**}

```json```

{

  "name": "John Smith",---

  "email": "johnsmith@example.com"

}## 🚀 Quick Copy-Paste

```

### Register

**Response (200):**```bash

```jsonPOST http://localhost:5000/api/auth/register

{Content-Type: application/json

  "success": true,

  "message": "Profile updated successfully",{

  "data": {  "name": "Test User",

    "_id": "674a...",  "email": "test@example.com",

    "name": "John Smith",  "password": "test123456"

    "email": "johnsmith@example.com",}

    "role": "user"```

  }

}### Login

``````bash

POST http://localhost:5000/api/auth/login

---Content-Type: application/json



### Change Password{

  "email": "test@example.com",

**PUT** `/api/users/change-password`    "password": "test123456"

**Auth:** ✅ Yes}

```

**Request:**

```json### Get Profile

{```bash

  "currentPassword": "oldPassword123",GET http://localhost:5000/api/users/profile

  "newPassword": "newPassword456"Authorization: Bearer YOUR_TOKEN_HERE

}```

```

### Chat

**Response (200):**```bash

```jsonPOST http://localhost:5000/api/chat

{Authorization: Bearer YOUR_TOKEN_HERE

  "success": true,Content-Type: application/json

  "message": "Password changed successfully"

}{

```  "message": "gaming laptop under 5000 GHS"

}

---```



## 💬 Chat (Gemini AI)---



### Send Message**Last Updated**: November 28, 2025


**POST** `/api/chat`  
**Auth:** ✅ Yes

**Request:**
```json
{
  "message": "I need a Dell laptop under 5000 GHS",
  "sessionId": "optional-session-id"
}
```

**Parameters:**
- `message` (required) - User's message
- `sessionId` (optional) - For conversation continuity

**Response (200) - Product Search:**
```json
{
  "success": true,
  "data": {
    "action": "search_products",
    "reply": "Great! I found several Dell laptops within your budget.",
    "recommendations": [
      {
        "marketplace": "jumia",
        "productId": "300587397",
        "title": "DELL PROMAX 16 - Black",
        "price": 25000,
        "currency": "GHS",
        "image": "https://gh.jumia.is/unsafe/fit-in/300x300/.../1.jpg",
        "productUrl": "https://www.jumia.com.gh/dell-promax-16-...",
        "rating": 4.5,
        "reviewsCount": 120,
        "quickActions": ["View Details", "Add to Cart"]
      }
    ],
    "sessionId": "674a1b2c-3d4e-5f6g-...",
    "conversationId": "674a..."
  }
}
```

**Response (200) - Clarifying Question:**
```json
{
  "success": true,
  "data": {
    "action": "ask_question",
    "reply": "What's your budget, and what will you use it for?",
    "sessionId": "674a1b2c-3d4e-5f6g-...",
    "conversationId": "674a..."
  }
}
```

---

### Get All Conversations

**GET** `/api/chat/conversations`  
**Auth:** ✅ Yes

**Query Parameters:**
- `page` (optional) - Default: 1
- `limit` (optional) - Default: 10

**Response (200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "674a...",
        "sessionId": "674a1b2c-3d4e-5f6g-...",
        "messageCount": 5,
        "lastMessage": "I found 12 Dell laptops...",
        "createdAt": "2025-12-01T10:30:00.000Z",
        "updatedAt": "2025-12-01T10:35:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalConversations": 25
    }
  }
}
```

---

### Get Specific Conversation

**GET** `/api/chat/conversations/:sessionId`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "674a...",
    "sessionId": "674a1b2c-3d4e-5f6g-...",
    "messages": [
      {
        "role": "user",
        "content": "I need a laptop",
        "timestamp": "2025-12-01T10:30:00.000Z"
      },
      {
        "role": "assistant",
        "content": "What's your budget?",
        "timestamp": "2025-12-01T10:30:05.000Z",
        "action": "ask_question"
      }
    ],
    "context": {
      "userPreferences": { "budget": 5000 },
      "marketplace": "jumia"
    }
  }
}
```

---

### Delete Conversation

**DELETE** `/api/chat/conversations/:sessionId`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

---

## 🛍️ Products

### Search Jumia Products

**GET** `/api/products/jumia/search`  
**Auth:** ✅ Yes

**Query Parameters:**
- `q` (required) - Search query
- `page` (optional) - Default: 1
- `limit` (optional) - Default: 20, Max: 50

**Example:** `/api/products/jumia/search?q=laptop&limit=10`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "marketplace": "jumia",
        "productId": "300587397",
        "title": "DELL PROMAX 16 - Black",
        "price": 25000,
        "currency": "GHS",
        "image": "https://gh.jumia.is/.../1.jpg",
        "productUrl": "https://www.jumia.com.gh/...",
        "rating": 4.5,
        "reviewsCount": 120,
        "inStock": true,
        "scrapedAt": "2025-12-01T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "resultsPerPage": 10,
      "totalResults": 45
    },
    "query": "laptop"
  }
}
```

---

### Get Product by ID

**GET** `/api/products/:marketplace/:productId`  
**Auth:** ✅ Yes

**Example:** `/api/products/jumia/300587397`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "674a...",
    "marketplace": "jumia",
    "productId": "300587397",
    "title": "DELL PROMAX 16 - Black",
    "price": 25000,
    "currency": "GHS",
    "image": "https://gh.jumia.is/.../1.jpg",
    "productUrl": "https://www.jumia.com.gh/...",
    "rating": 4.5,
    "reviewsCount": 120,
    "inStock": true
  }
}
```

---

### Redirect to Product

**GET** `/api/products/redirect/:marketplace/:productId`  
**Auth:** ✅ Yes

**Response:** HTTP 302 redirect to product URL

**Note:** Tracks product clicks for analytics.

---

### Refresh Product Data (Admin)

**POST** `/api/products/refresh/:marketplace/:productId`  
**Auth:** ✅ Yes (Admin)

**Response (200):**
```json
{
  "success": true,
  "message": "Product data refreshed successfully",
  "data": {
    // ... updated product
  }
}
```

---

## 🛒 Shopping Cart

### Get Cart

**GET** `/api/cart`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "674a...",
    "items": [
      {
        "_id": "674a...",
        "productId": {
          "_id": "674a...",
          "title": "DELL PROMAX 16 - Black",
          "price": 25000,
          "image": "https://gh.jumia.is/.../1.jpg"
        },
        "marketplace": "jumia",
        "quantity": 2,
        "addedAt": "2025-12-01T10:30:00.000Z"
      }
    ],
    "summary": {
      "itemCount": 2,
      "totalPrice": 50000,
      "currency": "GHS"
    }
  }
}
```

---

### Add to Cart

**POST** `/api/cart/add`  
**Auth:** ✅ Yes

**Request:**
```json
{
  "productId": "674a...",
  "marketplace": "jumia",
  "quantity": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    // ... updated cart
  }
}
```

---

### Update Cart Item

**PUT** `/api/cart/update/:itemId`  
**Auth:** ✅ Yes

**Request:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    // ... updated cart
  }
}
```

---

### Remove from Cart

**DELETE** `/api/cart/remove/:itemId`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### Clear Cart

**DELETE** `/api/cart/clear`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## ❤️ Wishlist

### Get Wishlist

**GET** `/api/wishlist`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "674a...",
    "items": [
      {
        "_id": "674a...",
        "productId": {
          "_id": "674a...",
          "title": "DELL PROMAX 16 - Black",
          "price": 25000,
          "image": "https://gh.jumia.is/.../1.jpg"
        },
        "marketplace": "jumia",
        "addedAt": "2025-12-01T10:30:00.000Z"
      }
    ],
    "itemCount": 1
  }
}
```

---

### Add to Wishlist

**POST** `/api/wishlist`  
**Auth:** ✅ Yes

**Request:**
```json
{
  "productId": "674a...",
  "marketplace": "jumia"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product added to wishlist"
}
```

---

### Remove from Wishlist

**DELETE** `/api/wishlist/:itemId`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

---

### Clear Wishlist

**DELETE** `/api/wishlist`  
**Auth:** ✅ Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Wishlist cleared successfully"
}
```

---

## 👨‍💼 Admin

**Note:** All admin endpoints require `role: "admin"`

### Get All Users

**GET** `/api/admin/users`  
**Auth:** ✅ Yes (Admin)

**Query Parameters:**
- `page` (optional) - Default: 1
- `limit` (optional) - Default: 20
- `role` (optional) - Filter by role

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "674a...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2025-11-28T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 100
    }
  }
}
```

---

### Get User by ID

**GET** `/api/admin/users/:id`  
**Auth:** ✅ Yes (Admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "674a...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "stats": {
      "totalConversations": 15,
      "cartItemCount": 3,
      "wishlistItemCount": 7
    }
  }
}
```

---

### Update User

**PUT** `/api/admin/users/:id`  
**Auth:** ✅ Yes (Admin)

**Request:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

### Delete User

**DELETE** `/api/admin/users/:id`  
**Auth:** ✅ Yes (Admin)

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Get Statistics

**GET** `/api/admin/stats`  
**Auth:** ✅ Yes (Admin)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "admins": 5,
      "regular": 1245,
      "newThisMonth": 120
    },
    "products": {
      "total": 5420,
      "byMarketplace": { "jumia": 5420 }
    },
    "conversations": {
      "total": 8340,
      "thisMonth": 650
    },
    "activity": {
      "activeUsersToday": 230,
      "activeUsersThisWeek": 890
    }
  }
}
```

---

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* ... */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Details (development only)"
}
```

---

## ⚠️ HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## 📝 Testing Examples

### Complete Flow
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# 2. Login (save token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Export token
export TOKEN="your-token-here"

# 4. Chat
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Dell laptop under 5000 GHS"}'

# 5. Search products
curl -X GET "http://localhost:5000/api/products/jumia/search?q=laptop" \
  -H "Authorization: Bearer $TOKEN"

# 6. Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"674a...","marketplace":"jumia","quantity":1}'
```

---

## 🎯 Best Practices

1. **Authentication**
   - Always include `Bearer` prefix
   - Store tokens securely
   - Logout when done

2. **Error Handling**
   - Check `success` field
   - Display user-friendly messages
   - Log errors for debugging

3. **Chat System**
   - Include `sessionId` for continuity
   - Handle both `ask_question` and `search_products`
   - Display recommendations clearly

4. **Performance**
   - Use pagination
   - Cache responses
   - Lazy load images

---

**Last Updated:** December 1, 2025  
**API Version:** 1.0.0  
**Status:** ✅ Production Ready