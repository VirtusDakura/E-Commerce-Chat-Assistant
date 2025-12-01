# 🔗 API Endpoints Quick Reference

## Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication Endpoints
**Base Path**: `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ No | Register new user |
| POST | `/api/auth/login` | ❌ No | Login user |
| POST | `/api/auth/logout` | ✅ Yes | Logout user (invalidate token) |
| POST | `/api/auth/forgot-password` | ❌ No | Request password reset |
| PUT | `/api/auth/reset-password/:token` | ❌ No | Reset password with token |

---

## 👤 User Endpoints
**Base Path**: `/api/users`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/users/profile` | ✅ Yes | Get current user profile |
| PUT | `/api/users/profile` | ✅ Yes | Update user profile |
| PUT | `/api/users/change-password` | ✅ Yes | Change password |

---

## 💬 Chat Endpoints (Gemini AI)
**Base Path**: `/api/chat`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/chat` | ✅ Yes | Send message to AI (main chat) |
| GET | `/api/chat/conversations` | ✅ Yes | List all user conversations |
| GET | `/api/chat/conversations/:sessionId` | ✅ Yes | Get conversation history |
| DELETE | `/api/chat/conversations/:sessionId` | ✅ Yes | Delete conversation |

---

## 🛍️ Product Endpoints
**Base Path**: `/api/products`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/products` | ✅ Yes | Get all products (with filters) |
| GET | `/api/products/search` | ✅ Yes | Search products |
| GET | `/api/products/featured` | ✅ Yes | Get featured products |
| GET | `/api/products/compare` | ✅ Yes | Compare products |
| GET | `/api/products/jumia/search` | ✅ Yes | Search Jumia Ghana products |
| GET | `/api/products/:marketplace/:productId` | ✅ Yes | Get product by marketplace ID |
| GET | `/api/products/redirect/:marketplace/:productId` | ✅ Yes | Redirect to product (tracks click) |
| POST | `/api/products/refresh/:marketplace/:productId` | ✅ Yes (Admin) | Refresh product data |

---

## 🛒 Cart Endpoints
**Base Path**: `/api/cart`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/cart` | ✅ Yes | Get user cart |
| POST | `/api/cart/add` | ✅ Yes | Add product to cart |
| PUT | `/api/cart/update/:itemId` | ✅ Yes | Update cart item quantity |
| DELETE | `/api/cart/remove/:itemId` | ✅ Yes | Remove item from cart |
| DELETE | `/api/cart/clear` | ✅ Yes | Clear entire cart |

---

## ❤️ Wishlist Endpoints
**Base Path**: `/api/wishlist`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/wishlist` | ✅ Yes | Get user wishlist |
| POST | `/api/wishlist` | ✅ Yes | Add product to wishlist |
| DELETE | `/api/wishlist/:itemId` | ✅ Yes | Remove item from wishlist |
| DELETE | `/api/wishlist` | ✅ Yes | Clear entire wishlist |

---

## 👨‍💼 Admin Endpoints
**Base Path**: `/api/admin`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/admin/users` | ✅ Yes (Admin) | Get all users |
| GET | `/api/admin/users/:id` | ✅ Yes (Admin) | Get user by ID |
| PUT | `/api/admin/users/:id` | ✅ Yes (Admin) | Update user |
| DELETE | `/api/admin/users/:id` | ✅ Yes (Admin) | Delete user |
| GET | `/api/admin/stats` | ✅ Yes (Admin) | Get dashboard statistics |

---

## 🔑 Authentication Header Format

For all protected endpoints (✅ Yes), include this header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Example**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Common Query Parameters

### Pagination
```
?page=1&limit=20
```

### Product Filters
```
?category=Electronics&minPrice=1000&maxPrice=5000
```

### Search
```
?q=laptop
```

### Sort
```
?sortBy=price&order=asc
```

---

## ⚠️ Common Mistakes

### ❌ WRONG: `/api/auth/profile`
### ✅ CORRECT: `/api/users/profile`

The profile endpoint is under `/api/users`, not `/api/auth`!

### ❌ WRONG: Missing `Bearer` prefix
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ✅ CORRECT: Include `Bearer` prefix
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Testing Order

1. **Register** → `/api/auth/register`
2. **Login** → `/api/auth/login` (save token)
3. **Get Profile** → `/api/users/profile` (use token)
4. **Chat** → `/api/chat` (send message)
5. **Search Products** → `/api/products/jumia/search`
6. **Add to Cart** → `/api/cart`
7. **Add to Wishlist** → `/api/wishlist`

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Details (in development mode)"
}
```

---

## 🚀 Quick Copy-Paste

### Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123456"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123456"
}
```

### Get Profile
```bash
GET http://localhost:5000/api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

### Chat
```bash
POST http://localhost:5000/api/chat
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "message": "gaming laptop under 5000 GHS"
}
```

---

**Last Updated**: November 28, 2025
