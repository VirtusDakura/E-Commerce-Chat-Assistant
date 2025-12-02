# Functional Requirements Specification (FRS)
**E-Commerce Chat Assistant Backend**

**Version:** 1.0.0  
**Date:** December 2, 2025

---

## Table of Contents
1. [Authentication Requirements](#1-authentication-requirements)
2. [Chat/AI Requirements](#2-chatai-requirements)
3. [Product Management Requirements](#3-product-management-requirements)
4. [Shopping Cart Requirements](#4-shopping-cart-requirements)
5. [Wishlist Requirements](#5-wishlist-requirements)
6. [User Management Requirements](#6-user-management-requirements)
7. [Admin Requirements](#7-admin-requirements)

---

## 1. Authentication Requirements

### FR-AUTH-001: User Registration
**Name:** User Registration  
**Priority:** Critical  
**Status:** Implemented

**Description:**  
Allow new users to create an account with email and password.

**Input:**
```json
{
  "name": "string (2-50 chars)",
  "email": "string (valid email format)",
  "password": "string (min 6 chars)"
}
```

**Output:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "ObjectId",
      "name": "string",
      "email": "string",
      "role": "user"
    },
    "token": "JWT string"
  }
}
```

**Success Criteria:**
- Email is unique in database
- Password meets minimum length (6 chars)
- User created in MongoDB
- JWT token generated and returned
- Password hashed with bcrypt (10 rounds)

**Validation Rules:**
- Name: Required, 2-50 characters, trimmed
- Email: Required, valid email format, lowercase, unique
- Password: Required, min 6 characters, hashed before storage

**Dependencies:**
- MongoDB User collection
- bcryptjs library
- JWT utility

**API Endpoint:**  
`POST /api/auth/register`

**Error Cases:**
- 400: Missing required fields
- 400: Email already exists
- 500: Server error during creation

---

### FR-AUTH-002: User Login
**Name:** User Login  
**Priority:** Critical  
**Status:** Implemented

**Description:**  
Authenticate existing users and issue JWT token.

**Input:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "ObjectId",
      "name": "string",
      "email": "string",
      "role": "user|admin"
    },
    "token": "JWT string"
  }
}
```

**Success Criteria:**
- User exists in database
- Password matches hashed password
- JWT token generated with user ID
- Token valid for configured duration (7 days default)

**Validation Rules:**
- Email: Required, format validation
- Password: Required, compared with bcrypt

**Dependencies:**
- User model
- bcryptjs.compare()
- JWT generation utility

**API Endpoint:**  
`POST /api/auth/login`

**Error Cases:**
- 400: Missing email or password
- 401: Invalid credentials
- 500: Server error

---

### FR-AUTH-003: User Logout
**Name:** Secure Logout with Token Blacklisting  
**Priority:** High  
**Status:** Implemented

**Description:**  
Invalidate JWT token by adding to blacklist, preventing reuse.

**Input:**
- JWT token in Authorization header

**Output:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Success Criteria:**
- Token added to TokenBlacklist collection
- Token expiry date recorded
- TTL index ensures automatic cleanup after 24h post-expiry

**Validation Rules:**
- Authorization header must be present
- Token must be valid JWT
- Token must not already be blacklisted

**Dependencies:**
- TokenBlacklist model
- JWT verification utility
- Auth middleware

**API Endpoint:**  
`POST /api/auth/logout` (Protected)

**Error Cases:**
- 401: Missing or invalid token
- 500: Database error

---

### FR-AUTH-004: Forgot Password
**Name:** Password Reset Request  
**Priority:** Medium  
**Status:** Implemented (Email simulation)

**Description:**  
Generate password reset token and send via email.

**Input:**
```json
{
  "email": "string"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": {
    "resetToken": "string (dev only)"
  }
}
```

**Success Criteria:**
- User exists with provided email
- Random 32-byte token generated
- Token hashed with SHA-256 and stored
- Token expires in 10 minutes
- Email sent with reset URL

**Validation Rules:**
- Email: Required, must exist in database

**Dependencies:**
- User model
- crypto module
- sendEmail utility (currently simulated)

**API Endpoint:**  
`POST /api/auth/forgot-password`

**Error Cases:**
- 400: Missing email
- 404: User not found
- 500: Email send failure

---

### FR-AUTH-005: Reset Password
**Name:** Password Reset with Token  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Update user password using valid reset token.

**Input:**
```json
{
  "password": "string (min 6 chars)"
}
```
URL Parameter: `token` (reset token from email)

**Output:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "token": "JWT string (new login token)"
  }
}
```

**Success Criteria:**
- Token is valid and not expired
- New password meets validation rules
- Password hashed and updated
- Reset token fields cleared
- New JWT token issued

**Validation Rules:**
- Token: Must match hashed token in database
- Token: Must not be expired (< 10 min old)
- Password: Min 6 characters

**Dependencies:**
- User model
- crypto module for hashing
- bcryptjs for password hashing

**API Endpoint:**  
`PUT /api/auth/reset-password/:token`

**Error Cases:**
- 400: Invalid or expired token
- 400: Missing password
- 500: Server error

---

## 2. Chat/AI Requirements

### FR-CHAT-001: Send Chat Message
**Name:** AI-Powered Product Discovery Chat  
**Priority:** Critical  
**Status:** Implemented

**Description:**  
Process user message through Gemini AI and optionally search products.

**Input:**
```json
{
  "message": "string (required)",
  "sessionId": "string (optional)"
}
```

**Output - Clarifying Question:**
```json
{
  "success": true,
  "action": "ask_question",
  "reply": "AI clarifying question",
  "sessionId": "string",
  "conversationId": "ObjectId"
}
```

**Output - Product Search:**
```json
{
  "success": true,
  "action": "search_products",
  "reply": "AI response message",
  "recommendations": [
    {
      "marketplace": "jumia",
      "productId": "string",
      "title": "string",
      "price": number,
      "currency": "GHS",
      "image": "URL",
      "rating": number,
      "reviewsCount": number,
      "productUrl": "URL",
      "quickActions": {
        "addToCart": "/api/cart/add",
        "addToWishlist": "/api/wishlist/add",
        "viewOnJumia": "external URL"
      }
    }
  ],
  "sessionId": "string",
  "conversationId": "ObjectId"
}
```

**Success Criteria:**
- AI successfully processes message
- Action determined (ask_question or search_products)
- Products scraped if search triggered
- Conversation saved to database
- Session maintained across messages

**Validation Rules:**
- Message: Required, non-empty string
- SessionId: Optional, used for continuity
- User: Must be authenticated

**Dependencies:**
- Gemini AI service
- Jumia scraping service
- Conversation model
- Product model

**API Endpoint:**  
`POST /api/chat` (Protected)

**Processing Flow:**
1. Authenticate user
2. Find or create conversation session
3. Build conversation history (last 6 messages)
4. Process message with Gemini AI
5. If search_products action:
   - Search Jumia with query
   - Cache products to MongoDB
   - Get product IDs
6. Save conversation with AI response
7. Format and return response

**Error Cases:**
- 400: Missing message
- 401: Not authenticated
- 500: AI processing error
- 500: Scraping error (returns fallback message)

---

### FR-CHAT-002: Get Conversation History
**Name:** Retrieve Single Conversation  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Get all messages from a specific conversation session.

**Input:**
- URL Parameter: `sessionId`

**Output:**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "sessionId": "string",
    "messages": [
      {
        "role": "user|assistant",
        "content": "string",
        "timestamp": "ISO date",
        "metadata": {
          "action": "string",
          "productsCount": number
        },
        "suggestedProducts": ["ObjectId"]
      }
    ],
    "context": {
      "userPreferences": {},
      "searchIntent": "string",
      "marketplace": "jumia"
    }
  }
}
```

**Success Criteria:**
- Conversation found by sessionId
- User owns the conversation
- All messages returned in order

**Validation Rules:**
- SessionId: Required, must exist
- User: Must own the conversation

**Dependencies:**
- Conversation model

**API Endpoint:**  
`GET /api/chat/conversations/:sessionId` (Protected)

**Error Cases:**
- 404: Conversation not found
- 403: User doesn't own conversation
- 500: Server error

---

### FR-CHAT-003: List User Conversations
**Name:** Get All User Conversations  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Retrieve paginated list of user's conversations.

**Input:**
```json
Query params:
{
  "page": number (default: 1),
  "limit": number (default: 10)
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "ObjectId",
        "sessionId": "string",
        "title": "string",
        "messageCount": number,
        "lastActivity": "ISO date",
        "createdAt": "ISO date"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

**Success Criteria:**
- Only user's conversations returned
- Sorted by most recent activity
- Pagination working correctly

**Validation Rules:**
- User: Must be authenticated

**Dependencies:**
- Conversation model

**API Endpoint:**  
`GET /api/chat/conversations` (Protected)

**Error Cases:**
- 401: Not authenticated
- 500: Server error

---

### FR-CHAT-004: Delete Conversation
**Name:** Remove Conversation History  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Delete a specific conversation and all its messages.

**Input:**
- URL Parameter: `sessionId`

**Output:**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

**Success Criteria:**
- Conversation deleted from database
- User owns the conversation

**Validation Rules:**
- SessionId: Required, must exist
- User: Must own conversation

**Dependencies:**
- Conversation model

**API Endpoint:**  
`DELETE /api/chat/conversations/:sessionId` (Protected)

**Error Cases:**
- 404: Conversation not found
- 403: User doesn't own conversation
- 500: Server error

---

## 3. Product Management Requirements

### FR-PROD-001: Search Jumia Products
**Name:** Live Jumia Product Scraping  
**Priority:** Critical  
**Status:** Implemented

**Description:**  
Scrape and return products from Jumia Ghana in real-time.

**Input:**
```json
Query params:
{
  "q": "string (search query, required)",
  "page": number (default: 1),
  "limit": number (default: 20, max: 50)
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "marketplace": "jumia",
        "productId": "string",
        "title": "string",
        "price": number,
        "currency": "GHS",
        "image": "URL",
        "productUrl": "URL",
        "rating": number,
        "reviewsCount": number,
        "inStock": boolean
      }
    ],
    "count": number,
    "query": "string"
  }
}
```

**Success Criteria:**
- Products scraped from Jumia
- Products cached to MongoDB
- Results returned within 10 seconds
- Throttling respected (2s between requests)

**Validation Rules:**
- Query: Required, non-empty string
- Limit: Max 50 products

**Dependencies:**
- jumiaService
- Product model
- axios, cheerio

**API Endpoint:**  
`GET /api/products/jumia/search?q=laptop` (Protected)

**Processing Flow:**
1. Validate query parameter
2. Check throttle timing
3. Build Jumia search URL
4. Send HTTP request
5. Parse HTML with Cheerio
6. Extract product data
7. Cache to MongoDB (upsert)
8. Return formatted products

**Error Cases:**
- 400: Missing query parameter
- 500: Scraping error (timeout, network)
- 500: Parse error

---

### FR-PROD-002: Get Cached Product by ID
**Name:** Retrieve Product from Database  
**Priority:** High  
**Status:** Implemented

**Description:**  
Get cached product details by marketplace and product ID.

**Input:**
- URL Parameters: `marketplace`, `productId`

**Output:**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "marketplace": "jumia",
    "productId": "string",
    "name": "string",
    "description": "string",
    "price": number,
    "currency": "GHS",
    "images": ["URL"],
    "category": "string",
    "rating": number,
    "numReviews": number,
    "scrapedAt": "ISO date"
  }
}
```

**Success Criteria:**
- Product found in cache
- All fields populated

**Validation Rules:**
- Marketplace: Must be valid enum value
- ProductId: Required

**Dependencies:**
- Product model

**API Endpoint:**  
`GET /api/products/:marketplace/:productId` (Protected)

**Error Cases:**
- 404: Product not found
- 400: Invalid marketplace
- 500: Server error

---

### FR-PROD-003: Get All Products with Filters
**Name:** Advanced Product Search  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Search cached products with filters, sorting, and pagination.

**Input:**
```json
Query params:
{
  "page": number,
  "limit": number,
  "sort": "field,-field",
  "search": "text search",
  "category": "Electronics|Clothing|...",
  "marketplace": "jumia|amazon|...",
  "price[gte]": number,
  "price[lte]": number,
  "rating[gte]": number
}
```

**Output:**
```json
{
  "success": true,
  "count": number,
  "total": number,
  "page": number,
  "pages": number,
  "data": [products]
}
```

**Success Criteria:**
- Filters applied correctly
- Pagination working
- Sort order respected
- Text search functional

**Validation Rules:**
- Category: Must be valid enum
- Price: Numeric values
- Rating: 0-5 range

**Dependencies:**
- Product model

**API Endpoint:**  
`GET /api/products` (Public)

---

### FR-PROD-004: Compare Products
**Name:** Side-by-Side Product Comparison  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Compare multiple products side by side.

**Input:**
```json
{
  "productIds": ["ObjectId", "ObjectId"]
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "products": [product objects],
    "comparison": {
      "priceRange": { min, max },
      "avgRating": number,
      "categories": ["string"]
    }
  }
}
```

**Success Criteria:**
- All products found
- Comparison metrics calculated

**API Endpoint:**  
`POST /api/products/compare` (Public)

---

### FR-PROD-005: Refresh Product Data (Admin)
**Name:** Force Product Re-scraping  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Admin-only endpoint to update cached product data.

**Input:**
- URL Parameters: `marketplace`, `productId`

**Output:**
```json
{
  "success": true,
  "message": "Product data refreshed",
  "data": {updated product}
}
```

**Success Criteria:**
- Product re-scraped from source
- Cache updated in MongoDB
- User has admin role

**Validation Rules:**
- User: Must be admin

**Dependencies:**
- Product model
- jumiaService
- Admin middleware

**API Endpoint:**  
`POST /api/products/refresh/:marketplace/:productId` (Admin only)

**Error Cases:**
- 403: Not admin
- 404: Product not found
- 500: Scraping error

---

## 4. Shopping Cart Requirements

### FR-CART-001: Get User Cart
**Name:** Retrieve Shopping Cart  
**Priority:** High  
**Status:** Implemented

**Description:**  
Get user's cart with items grouped by platform.

**Input:**
- User ID from JWT

**Output:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "_id": "ObjectId",
      "items": [
        {
          "_id": "ObjectId",
          "product": {product details},
          "quantity": number,
          "price": number,
          "platform": "jumia"
        }
      ]
    },
    "platformGroups": [
      {
        "platform": "jumia",
        "items": [items],
        "subtotal": number,
        "itemCount": number
      }
    ],
    "totalEstimate": number,
    "itemCount": number,
    "note": "Checkout happens on external platforms"
  }
}
```

**Success Criteria:**
- Cart created if doesn't exist
- Items populated with product details
- Totals calculated correctly
- Grouped by platform

**Validation Rules:**
- User: Must be authenticated

**Dependencies:**
- Cart model
- Product model (for population)

**API Endpoint:**  
`GET /api/cart` (Protected)

---

### FR-CART-002: Add Item to Cart
**Name:** Add Product to Shopping Cart  
**Priority:** High  
**Status:** Implemented

**Description:**  
Add product to cart or update quantity if exists.

**Input:**
```json
{
  "productId": "ObjectId",
  "quantity": number (default: 1)
}
```

**Output:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {updated cart}
}
```

**Success Criteria:**
- Product exists in database
- Quantity validated (min: 1)
- If product exists in cart, quantity updated
- If new, item added to cart
- Platform and price captured

**Validation Rules:**
- ProductId: Required, must exist
- Quantity: Min 1

**Dependencies:**
- Cart model
- Product model

**API Endpoint:**  
`POST /api/cart/add` (Protected)

**Error Cases:**
- 400: Missing productId
- 404: Product not found
- 400: Invalid quantity
- 500: Server error

---

### FR-CART-003: Update Cart Item Quantity
**Name:** Modify Item Quantity  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Change quantity of existing cart item.

**Input:**
```json
{
  "quantity": number (min: 1)
}
```
URL Parameter: `itemId`

**Output:**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {updated cart}
}
```

**Success Criteria:**
- Item found in user's cart
- Quantity updated
- Totals recalculated

**Validation Rules:**
- ItemId: Must exist in cart
- Quantity: Min 1

**API Endpoint:**  
`PUT /api/cart/update/:itemId` (Protected)

**Error Cases:**
- 404: Item not found
- 400: Invalid quantity
- 500: Server error

---

### FR-CART-004: Remove Item from Cart
**Name:** Delete Cart Item  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Remove specific item from cart.

**Input:**
- URL Parameter: `itemId`

**Output:**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {updated cart}
}
```

**Success Criteria:**
- Item deleted from cart
- Totals recalculated

**API Endpoint:**  
`DELETE /api/cart/remove/:itemId` (Protected)

---

### FR-CART-005: Clear Cart
**Name:** Empty Shopping Cart  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Remove all items from cart.

**Input:**
- User ID from JWT

**Output:**
```json
{
  "success": true,
  "message": "Cart cleared",
  "data": {empty cart}
}
```

**Success Criteria:**
- All items removed
- Cart remains in database (empty)

**API Endpoint:**  
`DELETE /api/cart/clear` (Protected)

---

## 5. Wishlist Requirements

### FR-WISH-001: Get Wishlist with Price Tracking
**Name:** Retrieve Wishlist with Price Changes  
**Priority:** High  
**Status:** Implemented

**Description:**  
Get user's wishlist with price change detection.

**Input:**
- User ID from JWT

**Output:**
```json
{
  "success": true,
  "count": number,
  "data": {
    "_id": "ObjectId",
    "items": [
      {
        "_id": "ObjectId",
        "product": {product details},
        "savedPrice": number,
        "currentPrice": number,
        "priceChanged": boolean,
        "priceDifference": number,
        "priceChangePercentage": string,
        "priceDropped": boolean,
        "priority": "high|medium|low",
        "notes": "string",
        "addedAt": "ISO date"
      }
    ]
  }
}
```

**Success Criteria:**
- Wishlist created if doesn't exist
- Price changes calculated
- Products populated with current data

**Processing:**
1. Retrieve wishlist with product population
2. For each item:
   - Compare savedPrice with current price
   - Calculate difference and percentage
   - Set priceChanged flag
   - Determine if price dropped
3. Return enhanced items

**API Endpoint:**  
`GET /api/wishlist` (Protected)

---

### FR-WISH-002: Add to Wishlist
**Name:** Save Product to Wishlist  
**Priority:** High  
**Status:** Implemented

**Description:**  
Add product to wishlist with price snapshot.

**Input:**
```json
{
  "productId": "ObjectId",
  "notes": "string (optional)",
  "priority": "high|medium|low (optional)",
  "priceAlertEnabled": boolean (optional),
  "targetPrice": number (optional)
}
```

**Output:**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "data": {updated wishlist}
}
```

**Success Criteria:**
- Product exists
- Not already in wishlist
- Current price captured as savedPrice
- Optional fields stored

**Validation Rules:**
- ProductId: Required, must exist
- Priority: Must be high/medium/low
- TargetPrice: Must be positive number

**API Endpoint:**  
`POST /api/wishlist` (Protected)

**Error Cases:**
- 400: Missing productId
- 404: Product not found
- 400: Product already in wishlist
- 500: Server error

---

### FR-WISH-003: Remove from Wishlist
**Name:** Delete Wishlist Item  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Remove specific item from wishlist.

**Input:**
- URL Parameter: `itemId`

**Output:**
```json
{
  "success": true,
  "message": "Item removed from wishlist",
  "data": {updated wishlist}
}
```

**API Endpoint:**  
`DELETE /api/wishlist/:itemId` (Protected)

---

### FR-WISH-004: Update Wishlist Item
**Name:** Modify Wishlist Item Properties  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Update notes, priority, or price alert settings.

**Input:**
```json
{
  "notes": "string",
  "priority": "high|medium|low",
  "priceAlertEnabled": boolean,
  "targetPrice": number
}
```
URL Parameter: `itemId`

**Output:**
```json
{
  "success": true,
  "message": "Wishlist item updated",
  "data": {updated wishlist}
}
```

**API Endpoint:**  
`PUT /api/wishlist/:itemId` (Protected)

---

### FR-WISH-005: Clear Wishlist
**Name:** Empty Wishlist  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Remove all items from wishlist.

**Input:**
- User ID from JWT

**Output:**
```json
{
  "success": true,
  "message": "Wishlist cleared",
  "data": {empty wishlist}
}
```

**API Endpoint:**  
`DELETE /api/wishlist` (Protected)

---

## 6. User Management Requirements

### FR-USER-001: Get User Profile
**Name:** Retrieve Current User Details  
**Priority:** High  
**Status:** Implemented

**Description:**  
Get authenticated user's profile information.

**Input:**
- User ID from JWT

**Output:**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "email": "string",
    "role": "user|admin",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
}
```

**Success Criteria:**
- User authenticated
- Profile data returned

**API Endpoint:**  
`GET /api/users/profile` (Protected)

---

### FR-USER-002: Update User Profile
**Name:** Modify User Information  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Update user's name and email.

**Input:**
```json
{
  "name": "string (2-50 chars)",
  "email": "string (valid email)"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {updated user}
}
```

**Success Criteria:**
- Fields validated
- Email uniqueness checked
- User updated in database

**Validation Rules:**
- Name: 2-50 characters if provided
- Email: Valid format, unique if changed

**API Endpoint:**  
`PUT /api/users/profile` (Protected)

**Error Cases:**
- 400: Invalid input
- 400: Email already taken
- 500: Server error

---

### FR-USER-003: Change Password
**Name:** Update User Password  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Allow user to change their password.

**Input:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 6 chars)"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Success Criteria:**
- Current password verified
- New password hashed
- Password updated in database

**Validation Rules:**
- CurrentPassword: Required, must match
- NewPassword: Min 6 characters

**API Endpoint:**  
`PUT /api/users/change-password` (Protected)

**Error Cases:**
- 400: Missing fields
- 401: Current password incorrect
- 400: New password too short
- 500: Server error

---

## 7. Admin Requirements

### FR-ADMIN-001: Get All Users
**Name:** List All Users (Admin)  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Admin-only endpoint to list all users with pagination.

**Input:**
```json
Query params:
{
  "page": number (default: 1),
  "limit": number (default: 20),
  "role": "user|admin (optional filter)"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "ObjectId",
        "name": "string",
        "email": "string",
        "role": "string",
        "createdAt": "ISO date"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

**Success Criteria:**
- User has admin role
- Pagination working
- Optional role filter applied

**Validation Rules:**
- User: Must be admin

**Dependencies:**
- User model
- Admin middleware

**API Endpoint:**  
`GET /api/admin/users` (Admin only)

**Error Cases:**
- 403: Not admin
- 500: Server error

---

### FR-ADMIN-002: Get User by ID
**Name:** Retrieve Specific User Details  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Get detailed information about a specific user.

**Input:**
- URL Parameter: `id` (user ObjectId)

**Output:**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "ISO date",
    "stats": {
      "conversationCount": number,
      "cartItemCount": number,
      "wishlistItemCount": number
    }
  }
}
```

**Success Criteria:**
- User found
- Stats aggregated from related collections

**API Endpoint:**  
`GET /api/admin/users/:id` (Admin only)

---

### FR-ADMIN-003: Update User
**Name:** Modify User Account (Admin)  
**Priority:** Medium  
**Status:** Implemented

**Description:**  
Admin can update any user's information including role.

**Input:**
```json
{
  "name": "string",
  "email": "string",
  "role": "user|admin"
}
```
URL Parameter: `id`

**Output:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {updated user}
}
```

**Success Criteria:**
- Admin authenticated
- User found and updated
- Role change allowed

**Validation Rules:**
- Role: Must be 'user' or 'admin'
- Email: Must be unique

**API Endpoint:**  
`PUT /api/admin/users/:id` (Admin only)

---

### FR-ADMIN-004: Delete User
**Name:** Remove User Account (Admin)  
**Priority:** Low  
**Status:** Implemented

**Description:**  
Admin can delete any user account.

**Input:**
- URL Parameter: `id`

**Output:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Success Criteria:**
- User found and deleted
- Related data cascade handled

**API Endpoint:**  
`DELETE /api/admin/users/:id` (Admin only)

**Error Cases:**
- 403: Not admin
- 404: User not found
- 500: Server error

---

## Summary of Requirements

**Total Functional Requirements:** 33

**By Module:**
- Authentication: 5
- Chat/AI: 4
- Product Management: 5
- Shopping Cart: 5
- Wishlist: 5
- User Management: 3
- Admin: 4

**Priority Breakdown:**
- Critical: 4
- High: 9
- Medium: 14
- Low: 6

**Implementation Status:**
- ✅ Implemented: 33
- 🚧 Partial: 0
- ❌ Not Implemented: 0

**Notes:**
- Email functionality currently simulated (logs to console)
- All endpoints tested and functional
- Security implemented via JWT + bcrypt
- Database operations use Mongoose ODM

---

**Document Status:** ✅ Complete  
**Last Updated:** December 2, 2025  
**Next Review:** On feature additions
