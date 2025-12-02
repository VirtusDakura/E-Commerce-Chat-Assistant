# Database & ERD Documentation
**E-Commerce Chat Assistant Backend**

**Version:** 1.0.0  
**Date:** December 2, 2025

---

## Table of Contents
1. [Database Overview](#1-database-overview)
2. [Entity Relationship Diagram (ERD)](#2-entity-relationship-diagram-erd)
3. [Collection Schemas](#3-collection-schemas)
4. [Relationships & References](#4-relationships--references)
5. [Indexes & Performance](#5-indexes--performance)
6. [Data Constraints & Validation](#6-data-constraints--validation)
7. [CRUD Operations](#7-crud-operations)
8. [Data Migration & Versioning](#8-data-migration--versioning)
9. [Backup & Recovery](#9-backup--recovery)
10. [Query Patterns & Optimization](#10-query-patterns--optimization)

---

## 1. Database Overview

### 1.1 Database Technology

**Database:** MongoDB 6.0+  
**Hosting:** MongoDB Atlas (Cloud)  
**ODM:** Mongoose 8.0.3  
**Connection:** Single database, multiple collections

### 1.2 Database Configuration

```javascript
// config/database.js
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ has sensible defaults
      // No need for useNewUrlParser, useUnifiedTopology
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};
```

**Environment Variable:**
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### 1.3 Collections Summary

| Collection | Documents | Purpose | Key Features |
|------------|-----------|---------|--------------|
| **users** | User accounts | Authentication & user profiles | Unique email, password hashing, role-based access |
| **conversations** | Chat sessions | AI conversation history | Session tracking, context preservation |
| **products** | Product catalog | Cached marketplace products | Text search, compound unique key, scrape timestamps |
| **carts** | Shopping carts | User shopping carts | One per user, platform grouping |
| **wishlists** | User wishlists | Product wishlists with price tracking | Price alerts, priority levels |
| **tokenblacklists** | Revoked JWT tokens | Logout mechanism | TTL auto-expiry, temporary storage |

**Total Collections:** 6

---

## 2. Entity Relationship Diagram (ERD)

### 2.1 High-Level ERD

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Database: ecommerce_chat_db                         │
└─────────────────────────────────────────────────────────────────────────────┘


        ┌──────────────────────────────────────────────────┐
        │              users                               │
        │──────────────────────────────────────────────────│
        │ _id                    ObjectId (PK)             │
        │ name                   String                    │
        │ email                  String (UNIQUE)           │
        │ password               String (hashed, secret)   │
        │ role                   Enum ['user', 'admin']    │
        │ resetPasswordToken     String (nullable)         │
        │ resetPasswordExpire    Date (nullable)           │
        │ createdAt              Date                      │
        │ updatedAt              Date                      │
        └────────────┬─────────────────────┬───────────────┘
                     │                     │
                     │                     │
         ┌───────────┘                     └──────────────┐
         │ 1                                              │ 1
         │                                                │
         │ N                                              │ N
         │                                                │
         ▼                                                ▼
┌─────────────────────┐                         ┌─────────────────────┐
│   conversations     │                         │   tokenblacklists   │
│─────────────────────│                         │─────────────────────│
│ _id      ObjectId   │                         │ _id      ObjectId   │
│ user     ObjectId◄──┘                         │ token    String     │
│ sessionId String    │                         │ userId   ObjectId◄──┘
│ messages  Array     │                         │ expiresAt Date      │
│ intent    String    │                         │ createdAt Date      │
│ context   Object    │                         └─────────────────────┘
│ isActive  Boolean   │                              (TTL Index)
│ lastActivity Date   │
│ createdAt Date      │
│ updatedAt Date      │
└─────────────────────┘


        ┌──────────────────────────────────────────────────┐
        │              users (same as above)               │
        └────────────┬─────────────────────┬───────────────┘
                     │ 1                   │ 1
                     │                     │
                     │ 1                   │ 1
                     ▼                     ▼
         ┌───────────────────┐   ┌───────────────────┐
         │      carts        │   │    wishlists      │
         │───────────────────│   │───────────────────│
         │ _id    ObjectId   │   │ _id    ObjectId   │
         │ user   ObjectId◄──┘   │ user   ObjectId◄──┘
         │ items  Array      │   │ items  Array      │
         │   [                   │   [
         │     {                 │     {
         │       product─────┐   │       product─────┐
         │       quantity    │   │       savedPrice  │
         │       price       │   │       priority    │
         │       platform    │   │       notes       │
         │     }             │   │       addedAt     │
         │   ]               │   │     }             │
         │ platformGroups Map│   │   ]               │
         │ createdAt Date    │   │ collections  Map  │
         │ updatedAt Date    │   │ createdAt   Date  │
         └─────────┬─────────┘   │ updatedAt   Date  │
                   │             └─────────┬─────────┘
                   │                       │
                   │ N                     │ N
                   │                       │
                   │                       │
                   └───────────┬───────────┘
                               │ N
                               │
                               ▼
                   ┌───────────────────────┐
                   │      products         │
                   │───────────────────────│
                   │ _id           ObjectId│
                   │ marketplace   String  │
                   │ productId     String  │
                   │ name          String  │
                   │ description   String  │
                   │ price         Number  │
                   │ currency      String  │
                   │ category      String  │
                   │ images        Array   │
                   │ rating        Number  │
                   │ numReviews    Number  │
                   │ productUrl    String  │
                   │ featured      Boolean │
                   │ tags          Array   │
                   │ scrapedAt     Date    │
                   │ createdAt     Date    │
                   │ updatedAt     Date    │
                   └───────────────────────┘
                   (UNIQUE: marketplace + productId)


Legend:
  ─── = One-to-Many Relationship
  ◄── = Foreign Key Reference
  PK  = Primary Key
  UNIQUE = Unique Constraint
```

### 2.2 Relationship Types

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Conversations | 1:N | One user can have many conversations |
| User → Cart | 1:1 | One user has exactly one cart |
| User → Wishlist | 1:1 | One user has exactly one wishlist |
| User → TokenBlacklist | 1:N | One user can have multiple blacklisted tokens |
| Cart → Products | N:N | Cart can contain many products (via items array) |
| Wishlist → Products | N:N | Wishlist can contain many products (via items array) |
| Conversation → User | N:1 | Many conversations belong to one user |

---

## 3. Collection Schemas

### 3.1 Users Collection

**Collection Name:** `users`  
**Model File:** `models/User.js`

```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,                   // Unique constraint
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/        // Email validation regex
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false                   // Never include in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpire: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Middleware:**
```javascript
// Pre-save hook: Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**Instance Methods:**
```javascript
// Compare password for login
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};
```

**Indexes:**
```javascript
userSchema.index({ email: 1 }, { unique: true });
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye...",
  "role": "user",
  "resetPasswordToken": null,
  "resetPasswordExpire": null,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

---

### 3.2 Conversations Collection

**Collection Name:** `conversations`  
**Model File:** `models/Conversation.js`

```javascript
{
  _id: ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
    unique: false                   // Multiple users can have same sessionId
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'model'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },
    suggestedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  }],
  intent: {
    type: String,
    enum: ['product_search', 'general_inquiry', 'price_comparison', 'support'],
    default: 'general_inquiry'
  },
  context: {
    userPreferences: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },
    searchIntent: {
      type: String,
      default: ''
    },
    lastActivity: {
      type: Date,
      default: Date.now,
      index: true
    },
    marketplace: {
      type: String,
      enum: ['jumia', 'amazon', 'alibaba', 'all'],
      default: 'all'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
conversationSchema.index({ user: 1, isActive: 1 });
conversationSchema.index({ sessionId: 1 });
conversationSchema.index({ 'context.lastActivity': -1 });
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "sessionId": "chat_abc123xyz",
  "messages": [
    {
      "role": "user",
      "content": "I need a gaming laptop",
      "timestamp": "2025-12-02T10:00:00.000Z",
      "metadata": {},
      "suggestedProducts": []
    },
    {
      "role": "model",
      "content": "I found some great gaming laptops for you!",
      "timestamp": "2025-12-02T10:00:03.000Z",
      "metadata": {
        "action": "search_products",
        "query": "gaming laptop"
      },
      "suggestedProducts": ["507f1f77bcf86cd799439020"]
    }
  ],
  "intent": "product_search",
  "context": {
    "userPreferences": {},
    "searchIntent": "gaming laptop",
    "lastActivity": "2025-12-02T10:00:03.000Z",
    "marketplace": "jumia"
  },
  "isActive": true,
  "createdAt": "2025-12-02T10:00:00.000Z",
  "updatedAt": "2025-12-02T10:00:03.000Z"
}
```

---

### 3.3 Products Collection

**Collection Name:** `products`  
**Model File:** `models/Product.js`

```javascript
{
  _id: ObjectId,
  marketplace: {
    type: String,
    required: true,
    enum: ['jumia', 'amazon', 'alibaba', 'ebay', 'aliexpress'],
    index: true
  },
  productId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    text: true                      // Text index for search
  },
  description: {
    type: String,
    trim: true,
    text: true                      // Text index for search
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'GHS',
    enum: ['GHS', 'USD', 'EUR', 'GBP', 'NGN']
  },
  category: {
    type: String,
    enum: [
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sports & Fitness',
      'Books',
      'Toys',
      'Health & Beauty',
      'Automotive',
      'Other'
    ],
    default: 'Other'
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    min: 0,
    default: 0
  },
  productUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid product URL'
    }
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  scrapedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
// Compound unique index
productSchema.index({ marketplace: 1, productId: 1 }, { unique: true });

// Text search index
productSchema.index({ name: 'text', description: 'text' });

// Query optimization
productSchema.index({ category: 1, price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ scrapedAt: -1 });
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "marketplace": "jumia",
  "productId": "hp-pavilion-gaming-12345",
  "name": "HP Pavilion Gaming Laptop - 15.6\" FHD",
  "description": "Powerful gaming laptop with GTX 1650 graphics",
  "price": 4500,
  "currency": "GHS",
  "category": "Electronics",
  "images": [
    "https://jumia.com.gh/images/hp-gaming-laptop.jpg"
  ],
  "rating": 4.5,
  "numReviews": 127,
  "productUrl": "https://www.jumia.com.gh/hp-pavilion-gaming-laptop",
  "featured": false,
  "tags": ["gaming", "laptop", "hp", "gtx"],
  "scrapedAt": "2025-12-02T09:45:00.000Z",
  "createdAt": "2025-11-20T14:30:00.000Z",
  "updatedAt": "2025-12-02T09:45:00.000Z"
}
```

---

### 3.4 Carts Collection

**Collection Name:** `carts`  
**Model File:** `models/Cart.js`

```javascript
{
  _id: ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,                   // One cart per user
    index: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0                        // Price at time of adding
    },
    platform: {
      type: String,
      required: true,
      enum: ['jumia', 'amazon', 'alibaba', 'ebay', 'aliexpress']
    },
    externalUrl: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  platformGroups: {
    type: Map,
    of: [{
      product: mongoose.Schema.Types.ObjectId,
      quantity: Number
    }],
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Virtual Fields:**
```javascript
// Calculate total price
cartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

// Count total items
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "user": "507f1f77bcf86cd799439011",
  "items": [
    {
      "product": "507f1f77bcf86cd799439020",
      "quantity": 1,
      "price": 4500,
      "platform": "jumia",
      "externalUrl": "https://www.jumia.com.gh/hp-pavilion-gaming-laptop",
      "addedAt": "2025-12-02T10:15:00.000Z"
    },
    {
      "product": "507f1f77bcf86cd799439021",
      "quantity": 2,
      "price": 150,
      "platform": "jumia",
      "externalUrl": "https://www.jumia.com.gh/wireless-mouse",
      "addedAt": "2025-12-02T10:20:00.000Z"
    }
  ],
  "platformGroups": {
    "jumia": [
      {
        "product": "507f1f77bcf86cd799439020",
        "quantity": 1
      },
      {
        "product": "507f1f77bcf86cd799439021",
        "quantity": 2
      }
    ]
  },
  "createdAt": "2025-12-02T10:15:00.000Z",
  "updatedAt": "2025-12-02T10:20:00.000Z"
}
```

---

### 3.5 Wishlists Collection

**Collection Name:** `wishlists`  
**Model File:** `models/Wishlist.js`

```javascript
{
  _id: ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,                   // One wishlist per user
    index: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    savedPrice: {
      type: Number,
      required: true,
      min: 0                        // Price when added to wishlist
    },
    priceChanged: {
      type: Boolean,
      default: false
    },
    priceAlertEnabled: {
      type: Boolean,
      default: false
    },
    targetPrice: {
      type: Number,
      min: 0,
      default: null                 // User's desired price
    },
    notes: {
      type: String,
      maxlength: 500,
      default: ''
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    addedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  }],
  collections: {
    type: Map,
    of: [{
      product: mongoose.Schema.Types.ObjectId,
      name: String
    }],
    default: {}                     // E.g., "Birthday Gifts", "Electronics"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
wishlistSchema.index({ user: 1 }, { unique: true });
wishlistSchema.index({ 'items.product': 1 });
wishlistSchema.index({ 'items.addedAt': -1 });
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439040",
  "user": "507f1f77bcf86cd799439011",
  "items": [
    {
      "product": "507f1f77bcf86cd799439022",
      "savedPrice": 2500,
      "priceChanged": true,
      "priceAlertEnabled": true,
      "targetPrice": 2000,
      "notes": "Wait for Black Friday sale",
      "priority": "high",
      "addedAt": "2025-11-15T08:00:00.000Z"
    },
    {
      "product": "507f1f77bcf86cd799439023",
      "savedPrice": 89.99,
      "priceChanged": false,
      "priceAlertEnabled": false,
      "targetPrice": null,
      "notes": "",
      "priority": "low",
      "addedAt": "2025-11-20T12:30:00.000Z"
    }
  ],
  "collections": {
    "Electronics": [
      {
        "product": "507f1f77bcf86cd799439022",
        "name": "Gaming Monitor"
      }
    ],
    "Gift Ideas": [
      {
        "product": "507f1f77bcf86cd799439023",
        "name": "Wireless Headphones"
      }
    ]
  },
  "createdAt": "2025-11-15T08:00:00.000Z",
  "updatedAt": "2025-11-20T12:30:00.000Z"
}
```

---

### 3.6 TokenBlacklists Collection

**Collection Name:** `tokenblacklists`  
**Model File:** `models/TokenBlacklist.js`

```javascript
{
  _id: ObjectId,
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true                     // TTL index
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**TTL Index:**
```javascript
// Automatically delete documents after expiration
tokenBlacklistSchema.index(
  { expiresAt: 1 }, 
  { expireAfterSeconds: 0 }        // Delete immediately when expiresAt passes
);

// Alternative: expire after 24 hours from creation
tokenBlacklistSchema.index(
  { createdAt: 1 }, 
  { expireAfterSeconds: 86400 }    // 24 hours
);
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439050",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "expiresAt": "2025-12-09T10:30:00.000Z",
  "createdAt": "2025-12-02T10:30:00.000Z"
}
```

---

## 4. Relationships & References

### 4.1 Reference Implementation

**One-to-Many: User → Conversations**
```javascript
// In Conversation model
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}

// Query with population
const conversations = await Conversation
  .find({ user: userId })
  .populate('user', 'name email')
  .exec();
```

**One-to-One: User → Cart**
```javascript
// In Cart model
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  unique: true
}

// Query
const cart = await Cart
  .findOne({ user: userId })
  .populate('items.product')
  .exec();
```

**Many-to-Many: Cart ↔ Products**
```javascript
// Embedded in Cart
items: [{
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  price: Number
}]

// Query with nested population
const cart = await Cart
  .findOne({ user: userId })
  .populate({
    path: 'items.product',
    select: 'name price images marketplace'
  })
  .exec();
```

### 4.2 Referential Integrity

**Mongoose References:**
- No automatic cascade delete
- No foreign key constraints (NoSQL nature)
- Managed in application code

**Example: Delete User Cascade**
```javascript
// In application code (not implemented in current system)
async function deleteUser(userId) {
  await User.findByIdAndDelete(userId);
  await Conversation.deleteMany({ user: userId });
  await Cart.deleteOne({ user: userId });
  await Wishlist.deleteOne({ user: userId });
  await TokenBlacklist.deleteMany({ userId });
}
```

**Orphaned Documents Risk:**
- Products referenced in deleted carts remain
- Conversations remain if user deleted
- **Mitigation:** Implement soft delete or cleanup scripts

---

## 5. Indexes & Performance

### 5.1 Index Strategy

**Index Types Used:**

| Index Type | Purpose | Collections |
|------------|---------|-------------|
| **Single Field** | Fast lookups on one field | All collections (_id, email, user) |
| **Compound** | Multi-field queries | products (marketplace+productId), conversations (user+isActive) |
| **Unique** | Prevent duplicates | users (email), carts (user), wishlists (user) |
| **Text** | Full-text search | products (name, description) |
| **TTL** | Auto-delete expired docs | tokenblacklists (expiresAt) |

### 5.2 Index Definitions

**users Collection:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```

**conversations Collection:**
```javascript
db.conversations.createIndex({ user: 1, isActive: 1 })
db.conversations.createIndex({ sessionId: 1 })
db.conversations.createIndex({ "context.lastActivity": -1 })
```

**products Collection:**
```javascript
db.products.createIndex({ marketplace: 1, productId: 1 }, { unique: true })
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ category: 1, price: 1 })
db.products.createIndex({ featured: 1 })
db.products.createIndex({ scrapedAt: -1 })
```

**carts Collection:**
```javascript
db.carts.createIndex({ user: 1 }, { unique: true })
```

**wishlists Collection:**
```javascript
db.wishlists.createIndex({ user: 1 }, { unique: true })
db.wishlists.createIndex({ "items.product": 1 })
db.wishlists.createIndex({ "items.addedAt": -1 })
```

**tokenblacklists Collection:**
```javascript
db.tokenblacklists.createIndex({ token: 1 }, { unique: true })
db.tokenblacklists.createIndex({ userId: 1 })
db.tokenblacklists.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### 5.3 Index Performance Analysis

**Query Performance Targets:**

| Query Type | Target | Index Used |
|------------|--------|------------|
| User login (by email) | < 10ms | email (unique) |
| Get user conversations | < 50ms | user + isActive |
| Product text search | < 100ms | Text index |
| Get user cart | < 20ms | user (unique) |
| Get user wishlist | < 20ms | user (unique) |
| Check token blacklist | < 10ms | token (unique) |

**Index Size Estimates:**
```
users.email: ~100 bytes per user
products (compound): ~200 bytes per product
products (text): ~500 bytes per product
conversations (compound): ~150 bytes per conversation
```

**Total Index Overhead:** ~20-30% of data size

---

## 6. Data Constraints & Validation

### 6.1 Schema-Level Validation

**users Collection:**
```javascript
{
  name: { minlength: 2, maxlength: 100 },
  email: { match: /^\S+@\S+\.\S+$/, unique: true },
  password: { minlength: 6, select: false },
  role: { enum: ['user', 'admin'] }
}
```

**products Collection:**
```javascript
{
  marketplace: { enum: ['jumia', 'amazon', ...] },
  price: { min: 0 },
  rating: { min: 0, max: 5 },
  numReviews: { min: 0 },
  images: { validate: URL regex },
  productUrl: { validate: URL regex }
}
```

**carts Collection:**
```javascript
{
  user: { unique: true },
  items[].quantity: { min: 1 },
  items[].price: { min: 0 }
}
```

**wishlists Collection:**
```javascript
{
  user: { unique: true },
  items[].priority: { enum: ['low', 'medium', 'high'] },
  items[].notes: { maxlength: 500 }
}
```

### 6.2 Application-Level Validation

**Controller Validation Examples:**

```javascript
// Auth Controller - Register
if (!name || !email || !password) {
  return res.status(400).json({ 
    success: false, 
    message: 'Please provide all fields' 
  });
}

if (password.length < 6) {
  return res.status(400).json({ 
    success: false, 
    message: 'Password must be at least 6 characters' 
  });
}

// Cart Controller - Add to Cart
if (quantity < 1) {
  return res.status(400).json({ 
    success: false, 
    message: 'Quantity must be at least 1' 
  });
}

// Check if product exists
const product = await Product.findById(productId);
if (!product) {
  return res.status(404).json({ 
    success: false, 
    message: 'Product not found' 
  });
}
```

### 6.3 Data Integrity Rules

**Business Rules:**

1. **One cart per user**
   - Enforced by unique index on carts.user
   - Controller checks for existing cart before creation

2. **One wishlist per user**
   - Enforced by unique index on wishlists.user
   - Controller checks for existing wishlist

3. **No duplicate products in cart**
   - Checked in controller before adding
   - Updates quantity if product already exists

4. **Password security**
   - Minimum 6 characters
   - Hashed with bcrypt (10 rounds)
   - Never returned in queries (select: false)

5. **Price snapshot**
   - Cart and wishlist store price at time of adding
   - Allows price change tracking

6. **Token expiration**
   - JWT tokens expire after 7 days
   - Blacklisted tokens auto-delete via TTL index

---

## 7. CRUD Operations

### 7.1 Create Operations

**Create User:**
```javascript
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'  // Will be hashed by pre-save hook
});
```

**Create Conversation:**
```javascript
const conversation = await Conversation.create({
  user: userId,
  sessionId: 'chat_' + Date.now(),
  messages: [{
    role: 'user',
    content: 'Hello'
  }],
  intent: 'general_inquiry'
});
```

**Cache Product (Upsert):**
```javascript
const product = await Product.findOneAndUpdate(
  { marketplace: 'jumia', productId: 'abc123' },
  {
    name: 'Laptop',
    price: 4500,
    currency: 'GHS',
    // ... other fields
    scrapedAt: new Date()
  },
  { upsert: true, new: true }
);
```

**Add to Cart:**
```javascript
let cart = await Cart.findOne({ user: userId });
if (!cart) {
  cart = await Cart.create({ user: userId, items: [] });
}

cart.items.push({
  product: productId,
  quantity: 1,
  price: product.price,
  platform: product.marketplace,
  externalUrl: product.productUrl
});

await cart.save();
```

### 7.2 Read Operations

**Get User by Email:**
```javascript
const user = await User.findOne({ email })
  .select('+password');  // Include password for login
```

**Get User Conversations:**
```javascript
const conversations = await Conversation.find({
  user: userId,
  isActive: true
})
  .sort({ 'context.lastActivity': -1 })
  .limit(10);
```

**Search Products (Text Search):**
```javascript
const products = await Product.find({
  $text: { $search: 'gaming laptop' },
  price: { $gte: minPrice, $lte: maxPrice },
  category: 'Electronics'
})
  .sort({ score: { $meta: 'textScore' } })
  .limit(20);
```

**Get Cart with Products:**
```javascript
const cart = await Cart.findOne({ user: userId })
  .populate({
    path: 'items.product',
    select: 'name price images marketplace currency'
  });
```

**Get Wishlist with Price Changes:**
```javascript
const wishlist = await Wishlist.findOne({ user: userId })
  .populate('items.product');

// Calculate price changes
wishlist.items.forEach(item => {
  const currentPrice = item.product.price;
  const savedPrice = item.savedPrice;
  item.priceChanged = currentPrice !== savedPrice;
});
```

### 7.3 Update Operations

**Update User Profile:**
```javascript
const user = await User.findByIdAndUpdate(
  userId,
  { name: 'Jane Doe' },
  { new: true, runValidators: true }
);
```

**Change Password:**
```javascript
const user = await User.findById(userId).select('+password');
user.password = newPassword;  // Will be hashed by pre-save hook
await user.save();
```

**Update Cart Item Quantity:**
```javascript
const cart = await Cart.findOne({ user: userId });
const item = cart.items.id(itemId);
item.quantity = newQuantity;
await cart.save();
```

**Update Wishlist Item Priority:**
```javascript
const wishlist = await Wishlist.findOne({ user: userId });
const item = wishlist.items.id(itemId);
item.priority = 'high';
item.notes = 'Buy this soon!';
await wishlist.save();
```

**Add Message to Conversation:**
```javascript
const conversation = await Conversation.findOne({ 
  sessionId, 
  user: userId 
});

conversation.messages.push({
  role: 'model',
  content: 'Here are some products...',
  suggestedProducts: [productId1, productId2]
});

conversation.context.lastActivity = new Date();
await conversation.save();
```

### 7.4 Delete Operations

**Delete User:**
```javascript
await User.findByIdAndDelete(userId);
```

**Delete Conversation:**
```javascript
await Conversation.findOneAndDelete({
  _id: conversationId,
  user: userId  // Ensure ownership
});
```

**Remove from Cart:**
```javascript
const cart = await Cart.findOne({ user: userId });
cart.items.id(itemId).remove();
await cart.save();
```

**Clear Cart:**
```javascript
await Cart.findOneAndUpdate(
  { user: userId },
  { items: [], platformGroups: {} }
);
```

**Remove from Wishlist:**
```javascript
const wishlist = await Wishlist.findOne({ user: userId });
wishlist.items.id(itemId).remove();
await wishlist.save();
```

**Blacklist Token (Logout):**
```javascript
await TokenBlacklist.create({
  token: jwt,
  userId: user._id,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});
```

---

## 8. Data Migration & Versioning

### 8.1 Schema Versioning

**Current Approach:** No formal versioning  
**Recommendation:** Add schema version field

```javascript
{
  __v: Number,  // Mongoose version key (already exists)
  schemaVersion: {
    type: String,
    default: '1.0.0'
  }
}
```

### 8.2 Migration Strategy

**For Schema Changes:**

1. **Adding new field (backward compatible):**
   ```javascript
   // Just update model, existing docs will get default value
   newField: {
     type: String,
     default: 'defaultValue'
   }
   ```

2. **Removing field:**
   ```javascript
   // Use MongoDB update to remove from all documents
   db.users.updateMany({}, { $unset: { oldField: "" } })
   ```

3. **Renaming field:**
   ```javascript
   // Use MongoDB rename operator
   db.products.updateMany({}, { $rename: { "oldName": "newName" } })
   ```

4. **Changing field type:**
   ```javascript
   // Create migration script
   const products = await Product.find({});
   for (const product of products) {
     product.price = parseFloat(product.price);
     await product.save();
   }
   ```

### 8.3 Migration Scripts

**Location:** `backend/scripts/migrations/`

**Example Migration Script:**
```javascript
// scripts/migrations/001_add_featured_to_products.js
const mongoose = require('mongoose');
const Product = require('../../models/Product');
const connectDB = require('../../config/database');

async function migrate() {
  await connectDB();
  
  await Product.updateMany(
    { featured: { $exists: false } },
    { $set: { featured: false } }
  );
  
  console.log('Migration complete');
  process.exit(0);
}

migrate();
```

---

## 9. Backup & Recovery

### 9.1 Backup Strategy

**MongoDB Atlas Automated Backups:**
- Continuous cloud backups
- Point-in-time recovery
- Retention: 7-35 days (configurable)

**Manual Backup Commands:**
```bash
# Full database backup
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)

# Specific collection backup
mongodump --uri="mongodb+srv://..." --collection=users --db=ecommerce_chat

# Restore from backup
mongorestore --uri="mongodb+srv://..." /backup/20251202
```

### 9.2 Data Export/Import

**Export to JSON:**
```bash
mongoexport --uri="mongodb+srv://..." --collection=products --out=products.json --jsonArray
```

**Import from JSON:**
```bash
mongoimport --uri="mongodb+srv://..." --collection=products --file=products.json --jsonArray
```

### 9.3 Disaster Recovery Plan

1. **Database Failure:**
   - Restore from MongoDB Atlas automated backup
   - Point-in-time recovery to last known good state

2. **Data Corruption:**
   - Identify affected collections
   - Restore specific collections from backup
   - Verify data integrity

3. **Accidental Deletion:**
   - Use soft delete pattern (add `deleted` flag)
   - Keep deleted data for 30 days before permanent removal

---

## 10. Query Patterns & Optimization

### 10.1 Common Query Patterns

**Pattern 1: Get User's Active Data**
```javascript
// Optimized: Single query with population
const [cart, wishlist, conversations] = await Promise.all([
  Cart.findOne({ user: userId }).populate('items.product'),
  Wishlist.findOne({ user: userId }).populate('items.product'),
  Conversation.find({ user: userId, isActive: true }).sort('-context.lastActivity').limit(5)
]);
```

**Pattern 2: Product Search with Filters**
```javascript
const query = {};

if (searchTerm) {
  query.$text = { $search: searchTerm };
}

if (category) {
  query.category = category;
}

if (minPrice || maxPrice) {
  query.price = {};
  if (minPrice) query.price.$gte = minPrice;
  if (maxPrice) query.price.$lte = maxPrice;
}

const products = await Product.find(query)
  .sort(sortBy)
  .skip((page - 1) * limit)
  .limit(limit);
```

**Pattern 3: Pagination with Count**
```javascript
const [products, total] = await Promise.all([
  Product.find(query).skip(skip).limit(limit),
  Product.countDocuments(query)
]);

const pagination = {
  currentPage: page,
  totalPages: Math.ceil(total / limit),
  totalItems: total,
  itemsPerPage: limit
};
```

### 10.2 Query Optimization Tips

**Use Projection:**
```javascript
// Bad: Fetch entire document
const users = await User.find({});

// Good: Select only needed fields
const users = await User.find({}).select('name email role');
```

**Lean Queries:**
```javascript
// Bad: Full Mongoose documents (heavy)
const products = await Product.find({});

// Good: Plain JavaScript objects (fast)
const products = await Product.find({}).lean();
```

**Index Usage:**
```javascript
// Check if query uses index
Product.find({ marketplace: 'jumia', productId: 'abc' }).explain('executionStats');
```

**Aggregation for Complex Queries:**
```javascript
// Get product count by category
const categoryCounts = await Product.aggregate([
  { $match: { marketplace: 'jumia' } },
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

### 10.3 Performance Monitoring

**Slow Query Logging:**
```javascript
mongoose.set('debug', true);  // Log all queries in development
```

**Query Performance Metrics:**
- Login query: < 10ms
- Product search: < 100ms
- Cart retrieval: < 20ms
- Conversation history: < 50ms

**Optimization Checklist:**
- ✅ Indexes on frequently queried fields
- ✅ Compound indexes for multi-field queries
- ✅ Text indexes for search
- ✅ Projection to limit returned fields
- ✅ Lean queries for read-only operations
- ✅ Pagination to limit result size
- ⚠️ Connection pooling (default Mongoose settings)
- ⚠️ Query result caching (not implemented - potential improvement)

---

## Summary

### Database Characteristics

**Collections:** 6  
**Total Indexes:** 15+  
**Unique Constraints:** 4  
**Text Search Indexes:** 1  
**TTL Indexes:** 1  

**Relationships:**
- 1:N (User → Conversations, User → TokenBlacklist)
- 1:1 (User → Cart, User → Wishlist)
- N:N (Cart ↔ Products, Wishlist ↔ Products)

**Key Features:**
- Password hashing with bcrypt
- JWT token blacklist with auto-expiry
- Product caching with timestamps
- Price tracking in wishlist
- Platform grouping in cart
- Full-text product search
- Conversation context persistence

**Performance Optimizations:**
- Strategic indexing (15+ indexes)
- Compound indexes for multi-field queries
- Text index for product search
- TTL index for automatic cleanup
- Lean queries for read-heavy operations
- Population for relationships

**Data Integrity:**
- Schema-level validation (Mongoose)
- Application-level validation (Controllers)
- Unique constraints (email, cart/wishlist per user)
- Password security (hashing, select: false)
- Price snapshots for comparison

---

**Document Status:** ✅ Complete  
**Last Updated:** December 2, 2025  
**Database Version:** MongoDB 6.0+ with Mongoose 8.0.3
