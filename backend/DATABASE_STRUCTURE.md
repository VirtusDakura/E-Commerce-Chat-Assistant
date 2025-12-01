# 🗄️ Database Structure - E-Commerce Chat Assistant

## MongoDB Atlas Database: `test`

### ✅ Expected Collections

Your project should have exactly **6 collections**:

1. **users** - User accounts and authentication
2. **tokenblacklists** - Invalidated JWT tokens (for logout)
3. **products** - Cached products from marketplaces
4. **conversations** - Chat history with Gemini AI
5. **carts** - User shopping carts
6. **wishlists** - User wishlists

---

## 1. **users** Collection
**Purpose**: Store user accounts and authentication data

**Schema**: `models/User.js`

**Fields**:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  role: String (enum: 'user', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `email`: unique index for fast lookup and prevent duplicates

**Sample Document**:
```json
{
  "_id": "674...",
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "$2a$10$...",
  "role": "user",
  "createdAt": "2025-11-28T12:00:00.000Z",
  "updatedAt": "2025-11-28T12:00:00.000Z"
}
```

---

## 2. **tokenblacklists** Collection
**Purpose**: Store invalidated JWT tokens when users logout

**Schema**: `models/TokenBlacklist.js`

**Fields**:
```javascript
{
  _id: ObjectId,
  token: String (unique, indexed),
  userId: ObjectId (ref: 'User', indexed),
  expiresAt: Date (TTL index),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `token`: unique index for fast lookup
- `userId`: index for user-based queries
- `expiresAt`: TTL index (automatically deletes expired tokens after 24 hours)

**Sample Document**:
```json
{
  "_id": "675...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "674...",
  "expiresAt": "2025-12-02T12:00:00.000Z",
  "createdAt": "2025-12-01T12:00:00.000Z",
  "updatedAt": "2025-12-01T12:00:00.000Z"
}
```

**Notes**:
- Tokens are automatically deleted 24 hours after expiry (MongoDB TTL index)
- Used to prevent logged-out users from accessing protected routes

---

## 3. **products** Collection
**Purpose**: Cache products scraped from external marketplaces (Jumia, Amazon, etc.)

**Schema**: `models/Product.js`

**Fields**:
```javascript
{
  _id: ObjectId,
  marketplace: String (enum: 'jumia', 'amazon', 'aliexpress', 'ebay', 'other'),
  productId: String (external marketplace product ID),
  name: String (indexed for text search),
  description: String (indexed for text search),
  price: Number,
  currency: String (default: 'GHS'),
  category: String (enum: Electronics, Clothing, etc.),
  productUrl: String,
  affiliateLink: String,
  availability: String,
  images: [String],
  brand: String,
  rating: Number (0-5),
  numReviews: Number,
  featured: Boolean,
  tags: [String],
  specifications: Map,
  scrapedAt: Date,
  lastSyncedAt: Date,
  raw: Mixed (scraped data, not selected by default),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{marketplace: 1, productId: 1}`: **Unique compound index** (prevents duplicate products)
- `{name: 'text', description: 'text'}`: Full-text search
- `{category: 1, price: 1}`: Filter by category and price
- `{featured: 1}`: Quick access to featured products
- `{marketplace: 1, scrapedAt: -1}`: Get latest products by marketplace

**Sample Document**:
```json
{
  "_id": "674...",
  "marketplace": "jumia",
  "productId": "hp-pavilion-gaming-15",
  "name": "HP Pavilion Gaming Laptop 15",
  "description": "...",
  "price": 4500,
  "currency": "GHS",
  "category": "Electronics",
  "productUrl": "https://jumia.com.gh/...",
  "images": ["https://..."],
  "rating": 4.5,
  "numReviews": 120,
  "scrapedAt": "2025-11-28T12:00:00.000Z"
}
```

---

## 3. **conversations** Collection
**Purpose**: Store chat conversations between users and Gemini AI

**Schema**: `models/Conversation.js`

**Fields**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  sessionId: String (indexed, client-generated UUID),
  title: String,
  messages: [
    {
      role: String (enum: 'user', 'assistant', 'system'),
      content: String,
      metadata: Mixed,
      suggestedProducts: [ObjectId] (ref: 'Product'),
      createdAt: Date,
      updatedAt: Date
    }
  ],
  intent: String (indexed, e.g., 'shopping', 'browsing'),
  context: {
    userPreferences: {
      priceRange: { min: Number, max: Number },
      categories: [String],
      brands: [String]
    },
    searchIntent: String,
    lastActivity: Date,
    marketplace: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{user: 1, isActive: 1}`: Get active conversations for user
- `{sessionId: 1}`: Fast lookup by session
- `{'context.lastActivity': -1}`: Sort by recent activity

**Sample Document**:
```json
{
  "_id": "674...",
  "user": "674...",
  "sessionId": "uuid-1234-5678",
  "title": "Product Search - Laptop",
  "messages": [
    {
      "role": "user",
      "content": "I need a laptop",
      "createdAt": "2025-11-28T12:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "What's your budget?",
      "createdAt": "2025-11-28T12:00:05.000Z"
    }
  ],
  "intent": "shopping",
  "isActive": true
}
```

---

## 4. **carts** Collection
**Purpose**: Store user shopping carts (products they want to buy)

**Schema**: `models/Cart.js`

**Fields**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', unique, indexed),
  items: [
    {
      _id: ObjectId,
      product: ObjectId (ref: 'Product'),
      quantity: Number (min: 1),
      price: Number,
      platform: String,
      externalUrl: String
    }
  ],
  platformGroups: Map,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{user: 1}`: One cart per user (unique)

**Sample Document**:
```json
{
  "_id": "674...",
  "user": "674...",
  "items": [
    {
      "_id": "674...",
      "product": "674...",
      "quantity": 1,
      "price": 4500,
      "platform": "jumia",
      "externalUrl": "https://jumia.com.gh/..."
    }
  ],
  "createdAt": "2025-11-28T12:00:00.000Z"
}
```

---

## 5. **wishlists** Collection
**Purpose**: Store user wishlists (products they want to save for later)

**Schema**: `models/Wishlist.js`

**Fields**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', unique, indexed),
  items: [
    {
      _id: ObjectId,
      product: ObjectId (ref: 'Product'),
      savedPrice: Number,
      priceChanged: Boolean,
      priceAlertEnabled: Boolean,
      targetPrice: Number,
      notes: String,
      priority: String (enum: 'high', 'medium', 'low'),
      addedAt: Date
    }
  ],
  collections: Map,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{user: 1}`: One wishlist per user (unique)
- `{'items.product': 1}`: Fast lookup of products in wishlists

**Sample Document**:
```json
{
  "_id": "674...",
  "user": "674...",
  "items": [
    {
      "_id": "674...",
      "product": "674...",
      "savedPrice": 4500,
      "priceChanged": false,
      "priceAlertEnabled": true,
      "priority": "high",
      "addedAt": "2025-11-28T12:00:00.000Z"
    }
  ],
  "createdAt": "2025-11-28T12:00:00.000Z"
}
```

---

## ❌ Collections That Should NOT Exist

### **orders** Collection
- **Status**: Not implemented in current project
- **Action**: Can be safely deleted
- **Reason**: This project is a product discovery/recommendation system, not a checkout/order system. Users are redirected to external marketplaces (Jumia, Amazon) to complete purchases.

---

## 🗑️ How to Clean Up Unused Collections

### Method 1: MongoDB Atlas UI (Easiest)
1. Go to MongoDB Atlas → Data Explorer
2. Select your database (`test`)
3. Click on the `orders` collection
4. Click "Drop Collection" button
5. Confirm deletion

### Method 2: Run Cleanup Script
```bash
cd backend
node scripts/cleanupDatabase.js
```

This script will:
- List all collections
- Identify collections not in your project
- Remove unused collections
- Show final clean state

---

## 📊 Database Statistics (From Your Screenshot)

| Collection | Documents | Avg Doc Size | Indexes | Total Index Size |
|------------|-----------|--------------|---------|------------------|
| carts | 1 | 133.00 B | 2 | 73.73 kB |
| conversations | 1 | 801.00 B | 5 | 161.55 kB |
| **orders** | 1 | 541.00 B | 3 | 110.59 kB | ❌ **DELETE THIS**
| products | 2 | 460.00 B | 8 | 229.38 kB |
| users | 3 | 212.00 B | 2 | 73.73 kB |
| wishlists | 1 | 117.00 B | 3 | 94.21 kB |

**Total Storage**: ~36.86 kB per collection (very minimal)

---

## 🔧 Database Maintenance

### Regular Tasks:

1. **Clean old scraped products** (>30 days)
   ```javascript
   // Run monthly
   db.products.deleteMany({
     scrapedAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) }
   })
   ```

2. **Archive old conversations** (>90 days inactive)
   ```javascript
   // Run quarterly
   db.conversations.updateMany(
     { 'context.lastActivity': { $lt: new Date(Date.now() - 90*24*60*60*1000) } },
     { $set: { isActive: false } }
   )
   ```

3. **Monitor index performance**
   - Check slow queries in MongoDB Atlas Performance tab
   - Add indexes if queries are slow

---

## 🎯 Expected Collection Count: **5 Collections**

✅ **Current status**: You have **6 collections** (1 extra: `orders`)

**After cleanup**: Should have exactly **5 collections** matching your project models.

---

## 📝 Notes

- All collections use **timestamps** (createdAt, updatedAt)
- **Unique constraints**: users.email, carts.user, wishlists.user, products.{marketplace+productId}
- **Indexes optimized** for common queries (no duplicates after recent fix)
- **Storage**: Very minimal (~200-300 kB total)
- **Database name**: Currently using `test` (consider renaming to `ecommerce-chat-assistant` in production)

---

**Last Updated**: November 28, 2025
