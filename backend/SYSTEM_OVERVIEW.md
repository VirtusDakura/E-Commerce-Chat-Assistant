# E-Commerce Chat Assistant - Backend API

## 🎯 Overview

This is a **Chat-Based E-Commerce Product Discovery Assistant** that helps users find and purchase products from popular e-commerce platforms (Jumia, Amazon, AliExpress, etc.) through conversational AI.

### Key Concept
- **NOT a standalone e-commerce store** - We aggregate products from external platforms
- **Chat-first interface** - Users interact with an AI assistant (like ChatGPT) to discover products
- **External purchases** - When ready to buy, users are redirected to the actual e-commerce platform
- **Smart recommendations** - AI suggests products based on conversation context

---

## 🏗️ Architecture

### Core Features

1. **Conversational AI** - Chat interface for product discovery
2. **Product Aggregation** - Products sourced from Jumia, Amazon, etc.
3. **Cart & Wishlist** - Users collect products before redirecting to external platforms
4. **User Management** - Authentication, profiles, preferences
5. **Admin Dashboard** - Manage users and monitor system

### Data Flow

```
User Message → AI Processing → Product Suggestions → Cart/Wishlist → External Platform Redirect
```

---

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js              # User authentication & profiles
│   ├── Conversation.js      # Chat history & context
│   ├── Product.js           # External product references
│   ├── Cart.js              # Product collection (no checkout)
│   └── Wishlist.js          # Saved products
├── controllers/
│   ├── authController.js    # Login, register, password reset
│   ├── chatController.js    # AI conversation management
│   ├── productController.js # Product search & discovery
│   ├── cartController.js    # Cart management
│   └── wishlistController.js
├── routes/
│   ├── authRoutes.js
│   ├── chatRoutes.js        # Core chat endpoints
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── wishlistRoutes.js
└── middleware/
    └── auth.js              # JWT authentication
```

---

## 🚀 API Endpoints

### 1. Chat (Core Feature)

#### **Create/Get Active Conversation**
```http
POST /api/chat/conversations
Authorization: Bearer {token}
```
Response:
```json
{
  "success": true,
  "data": {
    "_id": "conv_id",
    "user": "user_id",
    "messages": [],
    "context": {}
  }
}
```

#### **Send Message & Get AI Response**
```http
POST /api/chat/conversations/:id/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "I need a laptop for coding"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "conversation": {
      "messages": [
        {
          "role": "user",
          "content": "I need a laptop for coding"
        },
        {
          "role": "assistant",
          "content": "I'd be happy to help! What's your budget?",
          "suggestedProducts": ["prod_id_1", "prod_id_2"]
        }
      ]
    },
    "suggestedProducts": [
      {
        "_id": "prod_id_1",
        "name": "Dell XPS 15",
        "price": 1299.99,
        "platform": "Amazon",
        "externalUrl": "https://amazon.com/...",
        "images": ["..."],
        "rating": 4.5
      }
    ]
  }
}
```

#### **Get All Conversations**
```http
GET /api/chat/conversations
Authorization: Bearer {token}
```

#### **Get Single Conversation**
```http
GET /api/chat/conversations/:id
Authorization: Bearer {token}
```

#### **Delete Conversation**
```http
DELETE /api/chat/conversations/:id
Authorization: Bearer {token}
```

---

### 2. Products (External References)

#### **Search Products**
```http
GET /api/products/search?q=laptop&category=Electronics&minPrice=500&maxPrice=2000
```

Query Parameters:
- `q` - Text search
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minRating` - Minimum rating (1-5)
- `inStock` - Filter available products
- `platform` - Filter by platform (Jumia, Amazon, etc.)
- `sort` - Sort by (price-asc, price-desc, rating-desc, newest)

---

### 3. Cart (Product Collection)

#### **Add to Cart**
```http
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "prod_id",
  "quantity": 1
}
```

**Note:** Cart items include `externalUrl` and `platform` for redirection to external checkout.

#### **Get Cart**
```http
GET /api/cart
Authorization: Bearer {token}
```
Response includes products grouped by platform for easy multi-platform checkout.

---

### 4. Wishlist

#### **Add to Wishlist**
```http
POST /api/wishlist
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "prod_id"
}
```

---

## 🔑 Key Model Changes

### Product Model (External References)
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  // External product info
  platform: "Jumia" | "Amazon" | "AliExpress" | "eBay",
  externalUrl: String,        // Direct link to product on external platform
  externalProductId: String,   // ID on external platform
  affiliateLink: String,       // Optional affiliate link
  availability: "In Stock" | "Out of Stock" | "Unknown",
  images: [String],
  rating: Number,
  tags: [String],              // For better AI matching
  specifications: Map,          // Product specs
  lastSyncedAt: Date           // Last sync with external platform
}
```

### Conversation Model (Chat History)
```javascript
{
  user: ObjectId,
  title: String,
  messages: [
    {
      role: "user" | "assistant",
      content: String,
      suggestedProducts: [ObjectId]
    }
  ],
  context: {
    userPreferences: {
      priceRange: { min, max },
      categories: [String],
      brands: [String]
    },
    searchIntent: String
  }
}
```

### Cart Model (No Checkout)
```javascript
{
  user: ObjectId,
  items: [
    {
      product: ObjectId,
      quantity: Number,
      price: Number,
      platform: String,        // For grouping by platform
      externalUrl: String      // Direct checkout link
    }
  ],
  platformGroups: Map         // Group items by platform
}
```

---

## 🔄 Typical User Flow

1. **User starts chat:** "I need a laptop for coding"
2. **AI asks clarifying questions:** Budget? Specs? Brand preference?
3. **AI suggests products** from Jumia, Amazon, etc. with images and prices
4. **User adds interesting products** to cart or wishlist
5. **When ready to purchase:**
   - Frontend shows cart grouped by platform
   - User clicks "Buy on Amazon" or "Buy on Jumia"
   - Opens external platform in new window with product link
   - User completes purchase on external platform

---

## 🛠️ Future Enhancements

### Immediate (v1.1)
- [ ] Integrate actual AI (OpenAI GPT-4, Claude, etc.)
- [ ] Add web scraping for real-time product data from Jumia/Amazon
- [ ] Implement affiliate link generation
- [ ] Add price tracking & alerts

### Medium Term (v1.2)
- [ ] Multi-language support
- [ ] Voice interaction
- [ ] Product comparison feature
- [ ] Price history graphs

### Long Term (v2.0)
- [ ] Browser extension for instant chat
- [ ] Mobile app
- [ ] Social sharing of product recommendations
- [ ] AI learns from user preferences over time

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
MongoDB Atlas account
```

### Installation
```bash
cd backend
npm install
```

### Environment Variables
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Future: AI API keys
# OPENAI_API_KEY=your_openai_key
# ANTHROPIC_API_KEY=your_claude_key
```

### Run
```bash
npm start
```

---

## 📝 Notes for Frontend Development

1. **Chat Interface**
   - Build a chat UI similar to ChatGPT
   - Display product cards inline with chat messages
   - Add "Add to Cart" buttons on suggested products

2. **Product Display**
   - Show platform logo (Jumia, Amazon, etc.)
   - Display "View on [Platform]" button with external link
   - Show availability status

3. **Cart/Checkout**
   - Group cart items by platform
   - Provide separate "Checkout on [Platform]" buttons
   - Open external links in new window/tab

4. **Conversation History**
   - Show list of past conversations
   - Allow resuming conversations
   - Quick access to previously suggested products

---

## 🤝 Contributing

This is a chat-based product discovery assistant, NOT a traditional e-commerce platform. All product purchases happen on external platforms (Jumia, Amazon, etc.).

---

## 📄 License

MIT License - See LICENSE file for details
