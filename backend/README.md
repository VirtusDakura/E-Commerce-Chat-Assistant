# E-Commerce Chat Assistant Backend

A clean, feature-by-feature backend starter for an AI-powered e-commerce platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string.

### 3. Start Server
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

### 4. Verify
```bash
curl http://localhost:5000/health
```

## 📁 Current Structure

```
backend/
├── config/
│   └── database.js       # MongoDB connection
├── server.js             # Main entry point
├── package.json          # Dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## 🔧 Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce-chat-assistant
CORS_ORIGIN=http://localhost:3000
```

## 🎯 Next Steps

This is a minimal starter. We'll build features incrementally:

1. ⏳ Authentication system
2. ⏳ Product management
3. ⏳ Shopping cart
4. ⏳ AI chat assistant
5. ⏳ And more...

## �� Development

Run in development mode with auto-reload:
```bash
npm run dev
```

The server will restart automatically when you make changes.

---

**Ready to build!** 🚀
