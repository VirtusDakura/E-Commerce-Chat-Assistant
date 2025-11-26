# 📁 Project Structure

## Current Backend Structure

```
backend/
├── config/                 # Configuration files
│   └── database.js         # MongoDB connection
│
├── controllers/            # Request handlers (business logic)
│   └── .gitkeep           # (will add: authController.js, productController.js, etc.)
│
├── models/                 # Mongoose schemas
│   └── .gitkeep           # (will add: User.js, Product.js, Cart.js, etc.)
│
├── routes/                 # API route definitions
│   └── .gitkeep           # (will add: authRoutes.js, productRoutes.js, etc.)
│
├── middleware/             # Express middleware
│   └── .gitkeep           # (will add: authMiddleware.js, errorHandler.js, etc.)
│
├── services/               # Business logic layer
│   └── .gitkeep           # (will add: emailService.js, paymentService.js, etc.)
│
├── utils/                  # Helper functions
│   └── .gitkeep           # (will add: helpers.js, validators.js, etc.)
│
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── package.json            # Dependencies
├── .env.example            # Environment template
├── .env                    # Environment variables (created)
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

## Architecture Pattern

We're following the **MVC + Services** pattern:

```
Request → Routes → Middleware → Controllers → Services → Models → Database
                                      ↓
                                  Response
```

### Layer Responsibilities

**Routes** (`/routes`)
- Define API endpoints
- Map URLs to controllers
- Apply route-specific middleware

**Controllers** (`/controllers`)
- Handle HTTP requests/responses
- Validate input
- Call services
- Format responses

**Services** (`/services`)
- Business logic
- Data processing
- External API calls

**Models** (`/models`)
- Database schemas
- Data validation
- Database queries

**Middleware** (`/middleware`)
- Authentication
- Authorization
- Error handling
- Request validation

**Utils** (`/utils`)
- Helper functions
- Common utilities
- Validators

**Config** (`/config`)
- Database connection
- App configuration
- Environment setup

## Files Explained

### `server.js`
- Entry point
- Starts the Express server
- Handles graceful shutdown
- Connects to database

### `app.js`
- Express app configuration
- Middleware setup
- Route mounting
- Error handling

### `config/database.js`
- MongoDB connection logic
- Connection error handling

## Environment Variables

Your `.env` file should contain:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce-chat-assistant
CORS_ORIGIN=http://localhost:3000
```

## Next Steps

As we build features, we'll add:

1. **Authentication**
   - `models/User.js`
   - `controllers/authController.js`
   - `routes/authRoutes.js`
   - `middleware/authMiddleware.js`

2. **Products**
   - `models/Product.js`
   - `controllers/productController.js`
   - `routes/productRoutes.js`

3. **Cart**
   - `models/Cart.js`
   - `controllers/cartController.js`
   - `routes/cartRoutes.js`

4. **And more...**

## Best Practices Implemented

✅ Separation of concerns (MVC pattern)
✅ Environment-based configuration
✅ Graceful shutdown handling
✅ Error handling middleware
✅ CORS configuration
✅ Request logging (dev mode)
✅ Clean folder structure
✅ Git-friendly (.gitignore, .gitkeep)

---

**Ready to build!** Start by running: `npm run dev`
