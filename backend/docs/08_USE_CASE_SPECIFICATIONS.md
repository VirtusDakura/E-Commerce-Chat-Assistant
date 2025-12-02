# Use Case Specifications
**E-Commerce Chat Assistant Backend**

**Version:** 1.0.0  
**Date:** December 2, 2025

---

## Table of Contents
1. [Use Case Overview](#1-use-case-overview)
2. [Authentication Use Cases](#2-authentication-use-cases)
3. [AI Chat Use Cases](#3-ai-chat-use-cases)
4. [Product Discovery Use Cases](#4-product-discovery-use-cases)
5. [Shopping Cart Use Cases](#5-shopping-cart-use-cases)
6. [Wishlist Use Cases](#6-wishlist-use-cases)
7. [User Management Use Cases](#7-user-management-use-cases)
8. [Admin Use Cases](#8-admin-use-cases)

---

## 1. Use Case Overview

### 1.1 Actors

| Actor | Description | Capabilities |
|-------|-------------|--------------|
| **Guest User** | Unauthenticated visitor | View products, search, browse |
| **Registered User** | Authenticated customer | All guest features + chat, cart, wishlist, profile |
| **Administrator** | System admin | All user features + user management, product refresh |
| **AI Assistant** | Gemini AI system | Process messages, provide recommendations |
| **External System** | Jumia marketplace | Provide product data via scraping |

### 1.2 Use Case Categories

**Total Use Cases:** 25

| Category | Count | Authentication Required |
|----------|-------|------------------------|
| Authentication | 5 | Mixed |
| AI Chat | 4 | Yes |
| Product Discovery | 5 | No |
| Shopping Cart | 5 | Yes |
| Wishlist | 5 | Yes |
| User Management | 3 | Yes |
| Admin Operations | 4 | Yes (Admin) |

### 1.3 Use Case Diagram (Text Representation)

```
┌─────────────────────────────────────────────────────────────┐
│                    System Boundary                           │
│        E-Commerce Chat Assistant Backend                     │
│                                                              │
│  Guest User                  Registered User                │
│      │                            │                         │
│      ├─ UC-01: View Products      ├─ UC-06: Chat with AI   │
│      ├─ UC-02: Search Products    ├─ UC-10: Manage Cart    │
│      └─ UC-03: Compare Products   ├─ UC-15: Manage Wishlist│
│                                   ├─ UC-20: Update Profile  │
│                                   └─ UC-04: Register        │
│                                                              │
│                          Administrator                       │
│                               │                              │
│                               ├─ UC-22: Manage Users        │
│                               ├─ UC-25: Refresh Products    │
│                               └─ (All User Features)        │
│                                                              │
│  External Systems:                                          │
│  - Gemini AI ──────► UC-06, UC-07, UC-08                  │
│  - Jumia Ghana ────► UC-02, UC-03, UC-25                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication Use Cases

### UC-01: User Registration

**ID:** UC-AUTH-01  
**Name:** User Registration  
**Actor:** Guest User  
**Priority:** Critical  
**Complexity:** Low

**Description:**  
A new user creates an account to access personalized features like AI chat, shopping cart, and wishlist.

**Preconditions:**
- User has valid email address
- Email is not already registered in system
- User has internet connection

**Main Flow:**
1. User navigates to registration page
2. User enters name, email, and password
3. System validates input:
   - Name: 2-100 characters
   - Email: valid format, unique
   - Password: minimum 6 characters
4. System hashes password using bcrypt (10 salt rounds)
5. System creates user account with role "user"
6. System generates JWT token (7-day expiry)
7. System returns token and user details
8. User is automatically logged in

**Postconditions:**
- New user account exists in database
- User receives authentication token
- Empty cart and wishlist are created (implicitly on first use)
- User can access protected features

**Alternative Flows:**

**Alt-1: Email Already Exists**
- 3a. System detects duplicate email
- 3b. System returns 409 Conflict error
- 3c. User must use different email or login

**Alt-2: Invalid Input**
- 3a. System detects validation errors
- 3b. System returns 400 Bad Request with specific errors
- 3c. User corrects input and resubmits

**Exception Flows:**

**Exc-1: Database Connection Error**
- System returns 500 Internal Server Error
- User is prompted to try again later

**Business Rules:**
- BR-01: One account per email address
- BR-02: Default role is "user" (not admin)
- BR-03: Password must be hashed before storage
- BR-04: Token expires after 7 days

**API Endpoint:** `POST /api/auth/register`

**Test Cases:**
- TC-01: Valid registration → Success (201)
- TC-02: Duplicate email → Conflict (409)
- TC-03: Invalid email format → Bad Request (400)
- TC-04: Password too short → Bad Request (400)
- TC-05: Missing required field → Bad Request (400)

---

### UC-02: User Login

**ID:** UC-AUTH-02  
**Name:** User Login  
**Actor:** Registered User  
**Priority:** Critical  
**Complexity:** Low

**Description:**  
Registered user authenticates with email and password to access their account.

**Preconditions:**
- User account exists in system
- User knows email and password

**Main Flow:**
1. User navigates to login page
2. User enters email and password
3. System validates input format
4. System finds user by email
5. System retrieves hashed password from database
6. System compares entered password with hash using bcrypt
7. System generates new JWT token (7-day expiry)
8. System returns token and user details
9. User is authenticated for subsequent requests

**Postconditions:**
- User receives valid JWT token
- User can access protected endpoints
- Token is valid for 7 days

**Alternative Flows:**

**Alt-1: Invalid Credentials**
- 6a. Password comparison fails
- 6b. System returns 401 Unauthorized
- 6c. User must re-enter correct credentials

**Alt-2: User Not Found**
- 4a. No user found with provided email
- 4b. System returns 401 Unauthorized
- 4c. User must register or use correct email

**Exception Flows:**

**Exc-1: Database Error**
- System returns 500 Internal Server Error
- Login attempt fails

**Business Rules:**
- BR-05: Password is never returned in response
- BR-06: Failed login attempts are not rate-limited (potential improvement)
- BR-07: Same user can have multiple active sessions (multiple tokens)

**Security Considerations:**
- Password never exposed in logs or responses
- Generic error message for invalid credentials (don't reveal if email exists)
- Token stored client-side (localStorage/secure storage)

**API Endpoint:** `POST /api/auth/login`

**Test Cases:**
- TC-06: Valid credentials → Success (200) with token
- TC-07: Wrong password → Unauthorized (401)
- TC-08: Non-existent email → Unauthorized (401)
- TC-09: Missing fields → Bad Request (400)

---

### UC-03: User Logout

**ID:** UC-AUTH-03  
**Name:** User Logout  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Low

**Description:**  
User terminates their session by invalidating their JWT token.

**Preconditions:**
- User is logged in
- User has valid JWT token

**Main Flow:**
1. User clicks logout button
2. Client sends logout request with JWT token in header
3. System verifies token signature
4. System extracts token expiry date from JWT payload
5. System creates TokenBlacklist entry:
   - token: full JWT string
   - userId: extracted from token
   - expiresAt: token expiry date
6. System saves blacklist entry to database
7. System returns success message
8. Client deletes token from storage
9. User is logged out

**Postconditions:**
- Token is blacklisted in database
- Token cannot be used for authentication
- User must login again to access protected features
- Blacklisted token auto-deletes after expiry via TTL index

**Alternative Flows:**

**Alt-1: Token Already Blacklisted**
- 3a. Token found in blacklist during verification
- 3b. System returns 401 Unauthorized
- 3c. User is already effectively logged out

**Alt-2: Invalid Token**
- 3a. Token signature verification fails
- 3b. System returns 401 Unauthorized
- 3c. User must login again

**Business Rules:**
- BR-08: Blacklisted tokens stored until natural expiry (7 days)
- BR-09: TTL index automatically removes expired tokens after 24 hours
- BR-10: Logout does not affect other active sessions (different devices)

**API Endpoint:** `POST /api/auth/logout`

**Test Cases:**
- TC-10: Valid token logout → Success (200)
- TC-11: Already blacklisted token → Unauthorized (401)
- TC-12: Invalid token → Unauthorized (401)
- TC-13: Missing token → Unauthorized (401)

---

### UC-04: Forgot Password

**ID:** UC-AUTH-04  
**Name:** Forgot Password  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Medium

**Description:**  
User requests password reset when they cannot remember their password.

**Preconditions:**
- User account exists
- User has access to registered email

**Main Flow:**
1. User navigates to forgot password page
2. User enters registered email address
3. System validates email format
4. System finds user by email
5. System generates random reset token (20 bytes, hex)
6. System hashes token with SHA-256
7. System stores hashed token in user document
8. System sets token expiry (10 minutes from now)
9. System sends email with reset link containing plain token
   - Note: Email currently simulated (console.log)
10. System returns success message
11. User receives email with reset link

**Postconditions:**
- Reset token stored in user document (hashed)
- Token expires after 10 minutes
- User can reset password using token

**Alternative Flows:**

**Alt-1: Email Not Found**
- 4a. No user with provided email
- 4b. System still returns success (security best practice)
- 4c. No email is sent
- 4d. Prevents email enumeration attack

**Business Rules:**
- BR-11: Reset token expires after 10 minutes
- BR-12: Token is single-use (cleared after password reset)
- BR-13: Success message shown even if email doesn't exist (security)
- BR-14: Only one active reset token per user

**Security Considerations:**
- Token hashed before storage (SHA-256)
- Short expiry time (10 minutes)
- Plain token only sent via email, never stored
- Generic success message (no user enumeration)

**API Endpoint:** `POST /api/auth/forgot-password`

**Test Cases:**
- TC-14: Valid email → Success (200) with token
- TC-15: Non-existent email → Success (200) but no email sent
- TC-16: Invalid email format → Bad Request (400)
- TC-17: Multiple requests → Latest token overwrites previous

---

### UC-05: Reset Password

**ID:** UC-AUTH-05  
**Name:** Reset Password  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Medium

**Description:**  
User sets new password using reset token received via email.

**Preconditions:**
- User has valid reset token from forgot password flow
- Token has not expired (< 10 minutes old)
- User has new password ready

**Main Flow:**
1. User clicks reset link in email with token parameter
2. User enters new password
3. System extracts token from URL
4. System hashes token with SHA-256
5. System finds user with matching hashed token
6. System checks token expiry date
7. System validates new password (min 6 characters)
8. System updates user password (will be hashed by pre-save hook)
9. System clears reset token and expiry from user document
10. System generates new JWT token
11. System returns token
12. User is automatically logged in

**Postconditions:**
- User password updated in database
- Reset token cleared from user document
- User receives new authentication token
- User can login with new password

**Alternative Flows:**

**Alt-1: Invalid Token**
- 5a. No user found with hashed token
- 5b. System returns 400 Bad Request "Invalid token"
- 5c. User must request new reset token

**Alt-2: Expired Token**
- 6a. Token expiry date has passed
- 6b. System returns 400 Bad Request "Token expired"
- 6c. User must request new reset token

**Alt-3: Invalid Password**
- 7a. Password too short (< 6 characters)
- 7b. System returns 400 Bad Request
- 7c. User enters longer password

**Business Rules:**
- BR-15: Token is single-use (cleared after reset)
- BR-16: New password must meet minimum requirements
- BR-17: User automatically logged in after reset
- BR-18: Old password becomes invalid immediately

**API Endpoint:** `PUT /api/auth/reset-password/:token`

**Test Cases:**
- TC-18: Valid token + password → Success (200) with new token
- TC-19: Expired token → Bad Request (400)
- TC-20: Invalid token → Bad Request (400)
- TC-21: Password too short → Bad Request (400)
- TC-22: Token already used → Bad Request (400)

---

## 3. AI Chat Use Cases

### UC-06: Send Chat Message

**ID:** UC-CHAT-01  
**Name:** Send Chat Message to AI Assistant  
**Actor:** Registered User, AI Assistant  
**Priority:** Critical  
**Complexity:** High

**Description:**  
User sends natural language message to AI assistant to get product recommendations or answers.

**Preconditions:**
- User is authenticated
- User has active session
- Gemini AI service is available
- Jumia website is accessible

**Main Flow:**
1. User types message in chat interface
2. User provides or system generates session ID
3. Client sends message to backend
4. System verifies user authentication
5. System finds or creates conversation document
6. System retrieves last 6 messages for context
7. System calls AI Service with message and history
8. AI Service sends request to Gemini AI API
9. Gemini AI analyzes message and returns structured JSON:
   - action: "ask_question" or "search_products"
   - query: search query (if action is search_products)
   - reply: conversational response
10. If action is "search_products":
    - System calls Jumia Service with query
    - Jumia Service scrapes Jumia website (2s throttle)
    - Products parsed from HTML
    - Products cached to database (upsert)
11. System saves user message to conversation
12. System saves AI response to conversation
13. System returns response with products (if any)
14. User sees AI reply and product recommendations

**Postconditions:**
- Conversation updated with new messages
- Products cached in database (if search performed)
- User receives relevant response
- Conversation context preserved for next message

**Alternative Flows:**

**Alt-1: AI Service Error**
- 8a. Gemini AI API returns error or times out
- 8b. System uses fallback logic:
     - action: "ask_question"
     - reply: "I'm having trouble processing your request..."
- 8c. User receives fallback response

**Alt-2: Scraping Fails**
- 10a. Jumia website unreachable or HTML changed
- 10b. System returns empty product array
- 10c. AI reply mentions no products found

**Alt-3: General Question (No Product Search)**
- 9a. AI determines action is "ask_question"
- 9b. No product search performed
- 9c. User receives conversational response only

**Exception Flows:**

**Exc-1: Database Error**
- System returns 500 error
- Conversation not saved

**Exc-2: Authentication Fails**
- System returns 401 Unauthorized
- User must login again

**Business Rules:**
- BR-19: Last 6 messages used for context (performance vs context balance)
- BR-20: Scraping throttled to 2 seconds between requests
- BR-21: Products cached to avoid repeated scraping
- BR-22: Each user can have multiple conversations (sessions)
- BR-23: AI response timeout: 30 seconds

**Performance:**
- AI response time: 1-3 seconds (normal)
- With product search: 3-8 seconds (includes scraping)
- Context window: Last 6 messages (~3 turns)

**API Endpoint:** `POST /api/chat`

**Test Cases:**
- TC-23: General question → Success with conversational reply
- TC-24: Product search query → Success with products
- TC-25: New session → Creates new conversation
- TC-26: Existing session → Appends to conversation
- TC-27: AI service down → Fallback response
- TC-28: Invalid session ID format → Bad Request

---

### UC-07: Get Conversation History

**ID:** UC-CHAT-02  
**Name:** Retrieve Conversation History  
**Actor:** Registered User  
**Priority:** Medium  
**Complexity:** Low

**Description:**  
User retrieves complete message history for a specific chat session.

**Preconditions:**
- User is authenticated
- Conversation exists with given session ID
- User owns the conversation

**Main Flow:**
1. User requests conversation by session ID
2. System verifies authentication
3. System queries conversation by sessionId and userId
4. System populates product references in messages
5. System returns complete conversation:
   - All messages (user and model)
   - Timestamps
   - Suggested products
   - Conversation metadata (intent, context)
6. User sees full chat history

**Postconditions:**
- User has access to complete conversation
- No data modification occurs

**Alternative Flows:**

**Alt-1: Conversation Not Found**
- 3a. No conversation found with sessionId
- 3b. System returns 404 Not Found
- 3c. User redirected or shown error

**Alt-2: Unauthorized Access**
- 3a. Conversation belongs to different user
- 3b. System returns 403 Forbidden
- 3c. User cannot access others' conversations

**Business Rules:**
- BR-24: Users can only access their own conversations
- BR-25: Conversations never deleted automatically
- BR-26: Product references populated for context

**API Endpoint:** `GET /api/chat/conversations/:sessionId`

**Test Cases:**
- TC-29: Valid session ID → Success with full history
- TC-30: Non-existent session → Not Found (404)
- TC-31: Other user's session → Forbidden (403)
- TC-32: Invalid session ID format → Bad Request (400)

---

### UC-08: List User Conversations

**ID:** UC-CHAT-03  
**Name:** List All User Conversations  
**Actor:** Registered User  
**Priority:** Medium  
**Complexity:** Low

**Description:**  
User retrieves list of all their chat sessions for quick access and resumption.

**Preconditions:**
- User is authenticated
- User may have zero or more conversations

**Main Flow:**
1. User navigates to conversation list page
2. System verifies authentication
3. System queries all conversations for user
4. System sorts by last activity (most recent first)
5. System applies pagination (default: 10 per page)
6. System returns conversation summaries:
   - Session ID
   - Last message preview
   - Intent type
   - Message count
   - Last activity timestamp
   - Active status
7. User sees list of conversations

**Postconditions:**
- User has overview of all conversations
- User can select conversation to resume

**Alternative Flows:**

**Alt-1: No Conversations**
- 3a. User has no conversations yet
- 3b. System returns empty array
- 3c. User shown empty state with prompt to start chatting

**Business Rules:**
- BR-27: Conversations sorted by last activity (newest first)
- BR-28: Pagination applied (default 10 items)
- BR-29: Only active conversations shown by default (filter option)

**API Endpoint:** `GET /api/chat/conversations?page=1&limit=10`

**Test Cases:**
- TC-33: User with conversations → Success with list
- TC-34: User with no conversations → Success with empty array
- TC-35: Pagination works correctly
- TC-36: Sorting by last activity correct

---

### UC-09: Delete Conversation

**ID:** UC-CHAT-04  
**Name:** Delete Conversation  
**Actor:** Registered User  
**Priority:** Low  
**Complexity:** Low

**Description:**  
User permanently deletes a chat conversation and all its messages.

**Preconditions:**
- User is authenticated
- Conversation exists
- User owns the conversation

**Main Flow:**
1. User selects conversation to delete
2. User confirms deletion
3. System verifies authentication
4. System finds conversation by sessionId and userId
5. System permanently deletes conversation from database
6. System returns success message
7. User sees confirmation
8. Conversation removed from list

**Postconditions:**
- Conversation permanently deleted
- All messages in conversation deleted
- Cannot be recovered

**Alternative Flows:**

**Alt-1: Conversation Not Found**
- 4a. No conversation with sessionId
- 4b. System returns 404 Not Found

**Alt-2: Unauthorized Deletion**
- 4a. Conversation belongs to different user
- 4b. System returns 403 Forbidden

**Business Rules:**
- BR-30: Deletion is permanent (no soft delete)
- BR-31: User can only delete own conversations
- BR-32: Referenced products remain in database (not deleted)

**API Endpoint:** `DELETE /api/chat/conversations/:sessionId`

**Test Cases:**
- TC-37: Valid deletion → Success (200)
- TC-38: Non-existent conversation → Not Found (404)
- TC-39: Other user's conversation → Forbidden (403)
- TC-40: Double deletion → Not Found (404)

---

## 4. Product Discovery Use Cases

### UC-10: Browse Products

**ID:** UC-PROD-01  
**Name:** Browse Cached Products  
**Actor:** Any User (Guest or Registered)  
**Priority:** High  
**Complexity:** Medium

**Description:**  
User browses products from cache with filtering, sorting, and pagination.

**Preconditions:**
- Products exist in database cache
- None (public endpoint)

**Main Flow:**
1. User navigates to products page
2. User optionally applies filters:
   - Category (Electronics, Fashion, etc.)
   - Marketplace (Jumia, Amazon, etc.)
   - Price range (min/max)
   - Featured status
3. User selects sorting:
   - Price (ascending/descending)
   - Rating (high to low)
   - Name (alphabetical)
   - Date added (newest first)
4. System builds query with filters
5. System applies sorting
6. System applies pagination (default: 20 per page)
7. System executes database query
8. System returns products with pagination metadata
9. User sees filtered, sorted product list

**Postconditions:**
- User views relevant products
- No data modification

**Alternative Flows:**

**Alt-1: No Products Match**
- 7a. Query returns empty result
- 7b. System returns empty array with pagination
- 7c. User sees "no products found" message

**Alt-2: Invalid Filter Values**
- 4a. Invalid price range (min > max)
- 4b. System returns 400 Bad Request
- 4c. User corrects filters

**Business Rules:**
- BR-33: Max 100 products per page (prevent abuse)
- BR-34: Default sorting: newest first
- BR-35: Price filter in local currency (GHS)
- BR-36: Category enum must match schema values

**Performance:**
- Query time: < 100ms (with indexes)
- Products indexed on: category, marketplace, price, featured

**API Endpoint:** `GET /api/products?category=Electronics&minPrice=1000&maxPrice=5000&sortBy=price&order=asc`

**Test Cases:**
- TC-41: No filters → All products with pagination
- TC-42: Category filter → Filtered products
- TC-43: Price range → Products within range
- TC-44: Sort by price ascending → Correctly sorted
- TC-45: Page 2 → Correct offset applied
- TC-46: Invalid price range → Bad Request

---

### UC-11: Search Products

**ID:** UC-PROD-02  
**Name:** Full-Text Product Search  
**Actor:** Any User  
**Priority:** High  
**Complexity:** Medium

**Description:**  
User performs text search across product names and descriptions.

**Preconditions:**
- Products indexed with text search
- None (public endpoint)

**Main Flow:**
1. User enters search query in search box
2. User submits search
3. System receives search query
4. System builds text search query with filters
5. System executes MongoDB text search on name and description
6. System sorts by text score (relevance)
7. System applies pagination
8. System returns matching products with scores
9. User sees relevant products ranked by relevance

**Postconditions:**
- User views search results
- Results ranked by relevance

**Alternative Flows:**

**Alt-1: No Results**
- 6a. No products match query
- 6b. System returns empty array
- 6c. User shown "no results" with suggestions

**Alt-2: Empty Query**
- 3a. User submits empty search
- 3b. System returns 400 Bad Request
- 3c. User enters search term

**Business Rules:**
- BR-37: Minimum 2 characters for search query
- BR-38: Search case-insensitive
- BR-39: Partial word matching supported
- BR-40: Results sorted by relevance score (text score)

**Performance:**
- Search query time: < 100ms (text index)
- Index on: name (text), description (text)

**API Endpoint:** `GET /api/products/search?q=gaming+laptop&minPrice=3000`

**Test Cases:**
- TC-47: Valid search → Relevant results
- TC-48: Partial match → Results with partial words
- TC-49: No results → Empty array
- TC-50: Search with filters → Filtered relevant results
- TC-51: Special characters → Sanitized search

---

### UC-12: Live Jumia Search

**ID:** UC-PROD-03  
**Name:** Real-Time Jumia Web Scraping  
**Actor:** Any User  
**Priority:** Medium  
**Complexity:** High

**Description:**  
User searches products directly from Jumia Ghana website with real-time scraping.

**Preconditions:**
- Jumia Ghana website accessible
- User has internet connection
- None (public endpoint but rate limited)

**Main Flow:**
1. User enters search query for live Jumia search
2. System receives request
3. System checks last scrape time (throttling)
4. If < 2 seconds since last scrape, waits
5. System builds Jumia search URL
6. System sends HTTP GET to Jumia with User-Agent header
7. System receives HTML response (timeout: 10s)
8. System parses HTML with Cheerio
9. System extracts product cards:
   - Product name
   - Price (GHS)
   - Image URL
   - Product URL
   - Rating
   - Review count
10. System caches each product to database (upsert):
    - marketplace: "jumia"
    - productId: extracted from URL
    - scrapedAt: current timestamp
11. System returns products array
12. User sees live product results

**Postconditions:**
- Products cached in database
- User sees current Jumia products
- Last scrape timestamp updated

**Alternative Flows:**

**Alt-1: Jumia Website Down**
- 6a. HTTP request fails or times out
- 6b. System retries with exponential backoff (3 attempts)
- 6c. If all retries fail, returns 500 error
- 6d. User shown error message

**Alt-2: HTML Structure Changed**
- 9a. Expected HTML elements not found
- 9b. System returns empty product array
- 9c. User sees "no products found"

**Alt-3: Rate Limited by Jumia**
- 6a. Jumia blocks request (429 or captcha)
- 6b. System returns error
- 6c. User must wait and retry

**Exception Flows:**

**Exc-1: Parse Error**
- System logs error
- Returns partial results or empty array

**Business Rules:**
- BR-41: Minimum 2 seconds between Jumia requests (throttle)
- BR-42: Maximum 3 retry attempts with exponential backoff
- BR-43: Request timeout: 10 seconds
- BR-44: Products auto-cached to database
- BR-45: User-Agent header required to avoid blocking

**Performance:**
- Expected time: 3-8 seconds
- Throttle delay: 2 seconds minimum
- Timeout: 10 seconds per request

**Security/Legal:**
- robots.txt compliance (should be checked)
- Rate limiting to avoid abuse
- User-Agent identification

**API Endpoint:** `GET /api/products/jumia/search?query=laptop&page=1`

**Test Cases:**
- TC-52: Valid search → Products from Jumia
- TC-53: Throttling works → 2s minimum between calls
- TC-54: Products cached → Found in database after scrape
- TC-55: Jumia down → Retry then error
- TC-56: Invalid query → Bad Request

---

### UC-13: Get Featured Products

**ID:** UC-PROD-04  
**Name:** Retrieve Featured Products  
**Actor:** Any User  
**Priority:** Low  
**Complexity:** Low

**Description:**  
User retrieves curated list of featured/recommended products.

**Preconditions:**
- Featured products exist in database
- None (public endpoint)

**Main Flow:**
1. User navigates to homepage or featured section
2. System queries products where featured=true
3. System applies limit (default: 10, max: 50)
4. System sorts by rating or date
5. System returns featured products
6. User sees curated recommendations

**Postconditions:**
- User views featured products
- No data modification

**Business Rules:**
- BR-46: Featured flag manually set (admin function)
- BR-47: Default limit: 10 products
- BR-48: Sorted by rating (highest first)

**API Endpoint:** `GET /api/products/featured?limit=10`

**Test Cases:**
- TC-57: Featured products exist → Success with list
- TC-58: No featured products → Empty array
- TC-59: Limit parameter works correctly

---

### UC-14: Compare Products

**ID:** UC-PROD-05  
**Name:** Compare Multiple Products  
**Actor:** Any User  
**Priority:** Low  
**Complexity:** Low

**Description:**  
User compares 2-5 products side-by-side to make informed decision.

**Preconditions:**
- Products exist in database
- User has 2-5 product IDs
- None (public endpoint)

**Main Flow:**
1. User selects products to compare (2-5 items)
2. System receives array of product IDs
3. System validates product count (2-5)
4. System queries all products by IDs
5. System calculates comparison summary:
   - Lowest price
   - Highest price
   - Average price
   - Highest rated product
   - Price differences
6. System returns products with summary
7. User sees side-by-side comparison

**Postconditions:**
- User has comparison data
- Can make informed purchase decision

**Alternative Flows:**

**Alt-1: Too Few Products**
- 3a. Less than 2 products provided
- 3b. System returns 400 Bad Request
- 3c. User adds more products

**Alt-2: Too Many Products**
- 3a. More than 5 products provided
- 3b. System returns 400 Bad Request
- 3c. User removes some products

**Alt-3: Product Not Found**
- 4a. One or more product IDs invalid
- 4b. System returns 404 with list of invalid IDs
- 4c. User corrects product selection

**Business Rules:**
- BR-49: Minimum 2 products for comparison
- BR-50: Maximum 5 products for comparison
- BR-51: All products must exist

**API Endpoint:** `POST /api/products/compare`

**Test Cases:**
- TC-60: Valid 3 products → Success with comparison
- TC-61: Only 1 product → Bad Request
- TC-62: 6 products → Bad Request
- TC-63: Invalid product ID → Not Found
- TC-64: Summary calculations correct

---

## 5. Shopping Cart Use Cases

### UC-15: Add to Cart

**ID:** UC-CART-01  
**Name:** Add Product to Shopping Cart  
**Actor:** Registered User  
**Priority:** Critical  
**Complexity:** Medium

**Description:**  
User adds product to their shopping cart for potential purchase.

**Preconditions:**
- User is authenticated
- Product exists in database
- Product is available

**Main Flow:**
1. User views product details
2. User clicks "Add to Cart"
3. User specifies quantity (default: 1)
4. System verifies authentication
5. System validates product exists
6. System finds or creates user's cart
7. System checks if product already in cart
8. If new product:
   - System adds item to cart with:
     - Product reference
     - Quantity
     - Current price (snapshot)
     - Platform (marketplace)
     - External URL
9. System updates platform grouping
10. System saves cart
11. System returns updated cart
12. User sees product in cart

**Postconditions:**
- Product added to cart
- Cart total updated
- Platform grouping maintained

**Alternative Flows:**

**Alt-1: Product Already in Cart**
- 7a. Product already exists in cart
- 7b. System returns 409 Conflict
- 7c. User can update quantity instead

**Alt-2: Invalid Quantity**
- 3a. Quantity < 1 or not a number
- 3b. System returns 400 Bad Request
- 3c. User enters valid quantity

**Alt-3: Product Not Found**
- 5a. Product ID invalid or deleted
- 5b. System returns 404 Not Found
- 5c. User selects different product

**Business Rules:**
- BR-52: One cart per user
- BR-53: Price snapshot taken at add time
- BR-54: No duplicate products (use update instead)
- BR-55: Minimum quantity: 1
- BR-56: Platform grouping for checkout organization

**API Endpoint:** `POST /api/cart/add`

**Test Cases:**
- TC-65: Add new product → Success (201)
- TC-66: Product already in cart → Conflict (409)
- TC-67: Invalid quantity → Bad Request (400)
- TC-68: Product not found → Not Found (404)
- TC-69: Unauthenticated → Unauthorized (401)

---

### UC-16: View Cart

**ID:** UC-CART-02  
**Name:** Retrieve Shopping Cart  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Low

**Description:**  
User views contents of their shopping cart with totals and platform grouping.

**Preconditions:**
- User is authenticated
- User may have empty or populated cart

**Main Flow:**
1. User navigates to cart page
2. System verifies authentication
3. System finds user's cart
4. System populates product references
5. System calculates totals:
   - Item subtotals (price × quantity)
   - Total cart value
   - Item count
6. System groups items by platform
7. System returns cart with all details
8. User sees cart contents

**Postconditions:**
- User views cart contents
- No modifications made

**Alternative Flows:**

**Alt-1: Empty Cart**
- 3a. User has no cart yet or cart is empty
- 3b. System returns empty cart object
- 3c. User sees "cart is empty" message

**Business Rules:**
- BR-57: Virtual fields calculated on retrieval (totalPrice, itemCount)
- BR-58: Products populated for display
- BR-59: Platform grouping for multi-marketplace support

**API Endpoint:** `GET /api/cart`

**Test Cases:**
- TC-70: Cart with items → Success with products
- TC-71: Empty cart → Success with empty items array
- TC-72: Totals calculated correctly
- TC-73: Platform grouping correct

---

### UC-17: Update Cart Item

**ID:** UC-CART-03  
**Name:** Update Cart Item Quantity  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Low

**Description:**  
User changes quantity of an item already in cart.

**Preconditions:**
- User is authenticated
- Item exists in user's cart

**Main Flow:**
1. User changes quantity in cart
2. System receives update request with item ID and new quantity
3. System verifies authentication
4. System finds user's cart
5. System finds specific cart item by subdocument ID
6. System validates new quantity (≥ 1)
7. System updates item quantity
8. System recalculates totals
9. System saves cart
10. System returns updated cart
11. User sees updated quantity and totals

**Postconditions:**
- Item quantity updated
- Cart totals recalculated
- Cart saved to database

**Alternative Flows:**

**Alt-1: Invalid Quantity**
- 6a. Quantity < 1
- 6b. System returns 400 Bad Request
- 6c. User enters valid quantity

**Alt-2: Item Not Found**
- 5a. Item ID not in cart
- 5b. System returns 404 Not Found
- 5c. User refreshes cart

**Business Rules:**
- BR-60: Minimum quantity: 1
- BR-61: No maximum quantity (though marketplaces have limits)
- BR-62: Price remains snapshot from add time

**API Endpoint:** `PUT /api/cart/update/:itemId`

**Test Cases:**
- TC-74: Valid update → Success with new quantity
- TC-75: Quantity = 0 → Bad Request (use remove instead)
- TC-76: Negative quantity → Bad Request
- TC-77: Item not found → Not Found
- TC-78: Totals recalculated correctly

---

### UC-18: Remove from Cart

**ID:** UC-CART-04  
**Name:** Remove Item from Cart  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Low

**Description:**  
User removes specific item from shopping cart.

**Preconditions:**
- User is authenticated
- Item exists in cart

**Main Flow:**
1. User clicks remove/delete on cart item
2. System verifies authentication
3. System finds user's cart
4. System finds specific item by subdocument ID
5. System removes item from cart items array
6. System updates platform grouping
7. System recalculates totals
8. System saves cart
9. System returns updated cart
10. User sees item removed

**Postconditions:**
- Item permanently removed from cart
- Cart totals updated
- Platform grouping updated

**Alternative Flows:**

**Alt-1: Item Not Found**
- 4a. Item ID not in cart
- 4b. System returns 404 Not Found

**Alt-2: Last Item Removed**
- 5a. Cart becomes empty after removal
- 5b. Cart object remains with empty items array
- 5c. User sees empty cart

**Business Rules:**
- BR-63: Removal is immediate (no confirmation required)
- BR-64: Product remains in database (not deleted)
- BR-65: Cart persists even when empty

**API Endpoint:** `DELETE /api/cart/remove/:itemId`

**Test Cases:**
- TC-79: Valid removal → Success
- TC-80: Item not found → Not Found
- TC-81: Last item → Empty cart
- TC-82: Totals recalculated correctly

---

### UC-19: Clear Cart

**ID:** UC-CART-05  
**Name:** Empty Entire Shopping Cart  
**Actor:** Registered User  
**Priority:** Medium  
**Complexity:** Low

**Description:**  
User removes all items from cart at once.

**Preconditions:**
- User is authenticated
- User has cart (may be empty)

**Main Flow:**
1. User clicks "Clear Cart" button
2. User confirms action
3. System verifies authentication
4. System finds user's cart
5. System removes all items
6. System clears platform grouping
7. System resets totals to 0
8. System saves cart
9. System returns empty cart
10. User sees empty cart

**Postconditions:**
- All items removed from cart
- Cart totals = 0
- Platform grouping cleared
- Cart document persists

**Business Rules:**
- BR-66: Confirmation recommended (UX consideration)
- BR-67: Cannot be undone
- BR-68: Products remain in database

**API Endpoint:** `DELETE /api/cart/clear`

**Test Cases:**
- TC-83: Cart with items → Empty cart
- TC-84: Already empty cart → Still success
- TC-85: Totals reset to 0

---

## 6. Wishlist Use Cases

### UC-20: Add to Wishlist

**ID:** UC-WISH-01  
**Name:** Add Product to Wishlist  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Medium

**Description:**  
User saves product to wishlist with optional notes and price alert settings.

**Preconditions:**
- User is authenticated
- Product exists in database

**Main Flow:**
1. User views product
2. User clicks "Add to Wishlist"
3. User optionally sets:
   - Priority (low/medium/high)
   - Target price for alerts
   - Enable/disable price alerts
   - Personal notes
4. System verifies authentication
5. System validates product exists
6. System finds or creates user's wishlist
7. System checks if product already in wishlist
8. If new:
   - System adds item with:
     - Product reference
     - Current price (savedPrice)
     - Priority (default: medium)
     - Notes
     - Target price
     - Price alert flag
     - Added timestamp
9. System saves wishlist
10. System returns updated wishlist
11. User sees product in wishlist

**Postconditions:**
- Product added to wishlist
- Price snapshot saved for future comparison
- Price alerts configured (if enabled)

**Alternative Flows:**

**Alt-1: Product Already in Wishlist**
- 7a. Product already exists
- 7b. System returns 409 Conflict
- 7c. User can update instead

**Alt-2: Product Not Found**
- 5a. Invalid product ID
- 5b. System returns 404 Not Found

**Business Rules:**
- BR-69: One wishlist per user
- BR-70: No duplicate products in wishlist
- BR-71: Price snapshot for tracking
- BR-72: Default priority: medium
- BR-73: Target price optional

**API Endpoint:** `POST /api/wishlist`

**Test Cases:**
- TC-86: Add new product → Success (201)
- TC-87: Product already in wishlist → Conflict (409)
- TC-88: With all optional fields → Saved correctly
- TC-89: Without optional fields → Defaults applied
- TC-90: Product not found → Not Found (404)

---

### UC-21: View Wishlist

**ID:** UC-WISH-02  
**Name:** Retrieve Wishlist with Price Changes  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Medium

**Description:**  
User views wishlist with price change tracking and alerts.

**Preconditions:**
- User is authenticated
- User may have empty or populated wishlist

**Main Flow:**
1. User navigates to wishlist page
2. System verifies authentication
3. System finds user's wishlist
4. System populates product references
5. For each item:
   - Compare current product price with savedPrice
   - Calculate price difference (amount and percentage)
   - Set priceChanged flag
   - Check if target price reached
6. System groups items by collection (if any)
7. System calculates summary:
   - Total items
   - Items with price drops
   - Items with price increases
   - Items at target price
8. System returns wishlist with analysis
9. User sees wishlist with price alerts

**Postconditions:**
- User informed of price changes
- Price comparison data available
- No modifications made

**Alternative Flows:**

**Alt-1: Empty Wishlist**
- 3a. User has no wishlist or empty
- 3b. System returns empty wishlist
- 3c. User sees "wishlist is empty"

**Alt-2: Product Deleted**
- 4a. Referenced product no longer exists
- 4b. System shows item with missing product warning
- 4c. User can remove from wishlist

**Business Rules:**
- BR-74: Price change calculated on-the-fly (not stored)
- BR-75: Price drop/increase highlighted in UI
- BR-76: Target price alerts shown if enabled
- BR-77: Collections grouping optional feature

**Performance:**
- Price comparison for N items
- Product population via Mongoose
- Query time: < 50ms (with indexes)

**API Endpoint:** `GET /api/wishlist`

**Test Cases:**
- TC-91: Wishlist with items → Success with price analysis
- TC-92: Empty wishlist → Success with empty array
- TC-93: Price dropped → priceChanged = true, negative difference
- TC-94: Price increased → priceChanged = true, positive difference
- TC-95: Target price reached → Alert shown

---

### UC-22: Update Wishlist Item

**ID:** UC-WISH-03  
**Name:** Update Wishlist Item Properties  
**Actor:** Registered User  
**Priority:** Medium  
**Complexity:** Low

**Description:**  
User updates notes, priority, or target price for wishlist item.

**Preconditions:**
- User is authenticated
- Item exists in wishlist

**Main Flow:**
1. User opens wishlist item details
2. User modifies:
   - Notes
   - Priority level
   - Target price
   - Price alert enabled/disabled
3. System verifies authentication
4. System finds user's wishlist
5. System finds specific item by subdocument ID
6. System validates new values
7. System updates item properties
8. System saves wishlist
9. System returns updated item
10. User sees updated properties

**Postconditions:**
- Item properties updated
- Wishlist saved to database
- Price alerts updated (if changed)

**Alternative Flows:**

**Alt-1: Item Not Found**
- 5a. Item ID not in wishlist
- 5b. System returns 404 Not Found

**Alt-2: Invalid Priority**
- 6a. Priority not in enum [low, medium, high]
- 6b. System returns 400 Bad Request

**Alt-3: Invalid Target Price**
- 6a. Target price < 0
- 6b. System returns 400 Bad Request

**Business Rules:**
- BR-78: Notes max length: 500 characters
- BR-79: Priority enum: low, medium, high
- BR-80: Target price must be positive
- BR-81: Partial updates supported

**API Endpoint:** `PUT /api/wishlist/:itemId`

**Test Cases:**
- TC-96: Update notes → Success
- TC-97: Update priority → Success
- TC-98: Update target price → Success
- TC-99: Toggle price alert → Success
- TC-100: Invalid priority → Bad Request
- TC-101: Item not found → Not Found

---

### UC-23: Remove from Wishlist

**ID:** UC-WISH-04  
**Name:** Remove Item from Wishlist  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Low

**Description:**  
User removes product from their wishlist.

**Preconditions:**
- User is authenticated
- Item exists in wishlist

**Main Flow:**
1. User clicks remove on wishlist item
2. System verifies authentication
3. System finds user's wishlist
4. System finds specific item by subdocument ID
5. System removes item from wishlist
6. System saves wishlist
7. System returns success message
8. User sees item removed

**Postconditions:**
- Item permanently removed from wishlist
- Product remains in database
- Price alerts disabled for that item

**Alternative Flows:**

**Alt-1: Item Not Found**
- 4a. Item ID not in wishlist
- 4b. System returns 404 Not Found

**Business Rules:**
- BR-82: Removal is immediate
- BR-83: Product not affected (remains in DB)
- BR-84: Cannot be undone (must re-add)

**API Endpoint:** `DELETE /api/wishlist/:itemId`

**Test Cases:**
- TC-102: Valid removal → Success
- TC-103: Item not found → Not Found
- TC-104: Last item → Empty wishlist

---

### UC-24: Clear Wishlist

**ID:** UC-WISH-05  
**Name:** Empty Entire Wishlist  
**Actor:** Registered User  
**Priority:** Low  
**Complexity:** Low

**Description:**  
User removes all items from wishlist at once.

**Preconditions:**
- User is authenticated
- User has wishlist

**Main Flow:**
1. User clicks "Clear Wishlist"
2. User confirms action
3. System verifies authentication
4. System finds user's wishlist
5. System removes all items
6. System clears collections grouping
7. System saves wishlist
8. System returns empty wishlist
9. User sees empty wishlist

**Postconditions:**
- All items removed
- All price alerts disabled
- Wishlist document persists

**Business Rules:**
- BR-85: Confirmation strongly recommended
- BR-86: Cannot be undone
- BR-87: Products remain in database

**API Endpoint:** `DELETE /api/wishlist`

**Test Cases:**
- TC-105: Wishlist with items → Empty wishlist
- TC-106: Already empty → Still success

---

## 7. User Management Use Cases

### UC-25: Get User Profile

**ID:** UC-USER-01  
**Name:** Retrieve User Profile  
**Actor:** Registered User  
**Priority:** Medium  
**Complexity:** Low

**Description:**  
User retrieves their account information.

**Preconditions:**
- User is authenticated

**Main Flow:**
1. User navigates to profile page
2. System verifies authentication
3. System retrieves user document by ID from token
4. System excludes password field
5. System returns user profile:
   - Name
   - Email
   - Role
   - Created date
6. User sees profile information

**Postconditions:**
- User views their profile
- Password never exposed

**Business Rules:**
- BR-88: Password always excluded (select: false)
- BR-89: User can only view own profile
- BR-90: Role displayed but cannot be self-modified

**API Endpoint:** `GET /api/users/profile`

**Test Cases:**
- TC-107: Valid request → Success with profile
- TC-108: Unauthenticated → Unauthorized
- TC-109: Password not in response

---

### UC-26: Update User Profile

**ID:** UC-USER-02  
**Name:** Update User Profile Information  
**Actor:** Registered User  
**Priority:** Medium  
**Complexity:** Low

**Description:**  
User updates their name and email address.

**Preconditions:**
- User is authenticated
- New email (if changed) is not taken

**Main Flow:**
1. User opens profile edit form
2. User modifies name and/or email
3. System verifies authentication
4. System validates new values:
   - Name: 2-100 characters
   - Email: valid format
5. If email changed, check uniqueness
6. System updates user document
7. System returns updated profile
8. User sees confirmation

**Postconditions:**
- Profile updated in database
- If email changed, user uses new email for login

**Alternative Flows:**

**Alt-1: Email Already Taken**
- 5a. New email belongs to another user
- 5b. System returns 409 Conflict
- 5c. User chooses different email

**Alt-2: Invalid Email Format**
- 4a. Email format invalid
- 4b. System returns 400 Bad Request

**Business Rules:**
- BR-91: Email must remain unique
- BR-92: User cannot change own role
- BR-93: Password not changed here (separate endpoint)

**API Endpoint:** `PUT /api/users/profile`

**Test Cases:**
- TC-110: Update name → Success
- TC-111: Update email → Success
- TC-112: Email taken → Conflict
- TC-113: Invalid email → Bad Request

---

### UC-27: Change Password

**ID:** UC-USER-03  
**Name:** Change User Password  
**Actor:** Registered User  
**Priority:** High  
**Complexity:** Medium

**Description:**  
User changes their password while logged in (requires current password).

**Preconditions:**
- User is authenticated
- User knows current password

**Main Flow:**
1. User opens change password form
2. User enters:
   - Current password
   - New password
3. System verifies authentication
4. System retrieves user with password field
5. System verifies current password with bcrypt
6. System validates new password (min 6 chars)
7. System updates password field (will be hashed by pre-save hook)
8. System saves user document
9. System generates new JWT token
10. System returns new token
11. User is re-authenticated with new token

**Postconditions:**
- Password updated in database
- Old password no longer valid
- User receives new token
- User remains logged in

**Alternative Flows:**

**Alt-1: Wrong Current Password**
- 5a. Current password verification fails
- 5b. System returns 401 Unauthorized
- 5c. User must enter correct current password

**Alt-2: New Password Too Short**
- 6a. New password < 6 characters
- 6b. System returns 400 Bad Request
- 6c. User enters longer password

**Business Rules:**
- BR-94: Current password required (security)
- BR-95: New password must meet minimum requirements
- BR-96: Password hashed before storage (bcrypt, 10 rounds)
- BR-97: New token issued after password change

**Security:**
- Current password verification prevents unauthorized changes
- Password never logged or exposed
- New token invalidates previous sessions (optional, not implemented)

**API Endpoint:** `PUT /api/users/change-password`

**Test Cases:**
- TC-114: Valid password change → Success with new token
- TC-115: Wrong current password → Unauthorized
- TC-116: New password too short → Bad Request
- TC-117: Can login with new password → Success

---

## 8. Admin Use Cases

### UC-28: List All Users

**ID:** UC-ADMIN-01  
**Name:** Retrieve All User Accounts  
**Actor:** Administrator  
**Priority:** Medium  
**Complexity:** Low

**Description:**  
Admin retrieves list of all users with filtering and pagination.

**Preconditions:**
- User is authenticated
- User has admin role

**Main Flow:**
1. Admin navigates to user management page
2. Admin optionally filters by role
3. System verifies authentication
4. System checks user role is "admin"
5. System queries users with filters
6. System applies pagination (default: 20 per page)
7. System excludes password fields
8. System returns user list with pagination metadata
9. Admin sees all users

**Postconditions:**
- Admin views user list
- No modifications made
- Passwords never exposed

**Alternative Flows:**

**Alt-1: Not Admin**
- 4a. User role is not "admin"
- 4b. System returns 403 Forbidden
- 4c. Access denied

**Business Rules:**
- BR-98: Only admins can list all users
- BR-99: Passwords always excluded
- BR-100: Default pagination: 20 per page

**API Endpoint:** `GET /api/admin/users?page=1&limit=20&role=user`

**Test Cases:**
- TC-118: Admin request → Success with user list
- TC-119: Non-admin → Forbidden
- TC-120: Filter by role → Filtered results
- TC-121: Pagination works correctly

---

### UC-29: Get User Details

**ID:** UC-ADMIN-02  
**Name:** Retrieve Specific User Details  
**Actor:** Administrator  
**Priority:** Medium  
**Complexity:** Low

**Description:**  
Admin retrieves detailed information about specific user including statistics.

**Preconditions:**
- User is authenticated
- User has admin role
- Target user exists

**Main Flow:**
1. Admin selects user to view
2. System verifies authentication
3. System checks admin role
4. System finds user by ID
5. System gathers user statistics:
   - Conversation count
   - Cart item count
   - Wishlist item count
6. System returns user details with stats
7. Admin sees complete user information

**Postconditions:**
- Admin has detailed user information
- No modifications made

**Alternative Flows:**

**Alt-1: User Not Found**
- 4a. Invalid user ID
- 4b. System returns 404 Not Found

**Alt-2: Not Admin**
- 3a. User is not admin
- 3b. System returns 403 Forbidden

**Business Rules:**
- BR-101: Only admins can view user details
- BR-102: Statistics calculated on request
- BR-103: Password excluded

**API Endpoint:** `GET /api/admin/users/:id`

**Test Cases:**
- TC-122: Admin views user → Success with details
- TC-123: Non-admin → Forbidden
- TC-124: User not found → Not Found
- TC-125: Statistics calculated correctly

---

### UC-30: Update User

**ID:** UC-ADMIN-03  
**Name:** Update User Account (Including Role)  
**Actor:** Administrator  
**Priority:** High  
**Complexity:** Medium

**Description:**  
Admin modifies user account details including role assignment.

**Preconditions:**
- User is authenticated
- User has admin role
- Target user exists

**Main Flow:**
1. Admin opens user edit form
2. Admin modifies:
   - Name
   - Email
   - Role (user/admin)
3. System verifies authentication
4. System checks admin role
5. System finds user by ID
6. System validates new values
7. If email changed, check uniqueness
8. System updates user document
9. System returns updated user
10. Admin sees confirmation

**Postconditions:**
- User account updated
- Role change effective immediately
- If promoted to admin, user gains admin privileges

**Alternative Flows:**

**Alt-1: Email Taken**
- 7a. New email belongs to another user
- 7b. System returns 409 Conflict

**Alt-2: Invalid Role**
- 6a. Role not in enum [user, admin]
- 6b. System returns 400 Bad Request

**Alt-3: Not Admin**
- 4a. Requester is not admin
- 4b. System returns 403 Forbidden

**Business Rules:**
- BR-104: Only admins can modify users
- BR-105: Admin can promote/demote roles
- BR-106: Admin cannot delete themselves (safety)
- BR-107: Email must remain unique

**Security:**
- Privilege escalation carefully controlled
- Admin actions should be logged (not implemented)

**API Endpoint:** `PUT /api/admin/users/:id`

**Test Cases:**
- TC-126: Admin updates user → Success
- TC-127: Promote to admin → Role changed
- TC-128: Non-admin attempt → Forbidden
- TC-129: Email conflict → Conflict
- TC-130: Invalid role → Bad Request

---

### UC-31: Delete User

**ID:** UC-ADMIN-04  
**Name:** Delete User Account  
**Actor:** Administrator  
**Priority:** High  
**Complexity:** Medium

**Description:**  
Admin permanently deletes user account and associated data.

**Preconditions:**
- User is authenticated
- User has admin role
- Target user exists
- Target user is not self

**Main Flow:**
1. Admin selects user to delete
2. Admin confirms deletion
3. System verifies authentication
4. System checks admin role
5. System finds user by ID
6. System checks admin not deleting self
7. System deletes user account
8. System returns success message
9. Admin sees confirmation

**Note:** Currently does not cascade delete related data (carts, wishlists, conversations). This should be implemented.

**Postconditions:**
- User account deleted from database
- User cannot login
- Related data orphaned (should be cleaned up)

**Alternative Flows:**

**Alt-1: Self-Deletion Attempt**
- 6a. Target user ID matches requester ID
- 6b. System returns 400 Bad Request
- 6c. Admin cannot delete themselves

**Alt-2: User Not Found**
- 5a. Invalid user ID
- 5b. System returns 404 Not Found

**Alt-3: Not Admin**
- 4a. Requester is not admin
- 4b. System returns 403 Forbidden

**Business Rules:**
- BR-108: Only admins can delete users
- BR-109: Admin cannot delete themselves (safety)
- BR-110: Deletion is permanent (no soft delete)
- BR-111: Should cascade delete related data (improvement needed)

**Data Cleanup (Recommended):**
```javascript
// Should implement cascade delete:
- Delete user's conversations
- Delete user's cart
- Delete user's wishlist
- Delete user's blacklisted tokens
```

**API Endpoint:** `DELETE /api/admin/users/:id`

**Test Cases:**
- TC-131: Admin deletes user → Success
- TC-132: Self-deletion → Bad Request
- TC-133: Non-admin → Forbidden
- TC-134: User not found → Not Found
- TC-135: Related data handling → Should be cleaned

---

## Summary

### Use Case Statistics

**Total Use Cases:** 31  
**Actors:** 5 (Guest, User, Admin, AI, External System)  
**Categories:** 8

**Priority Breakdown:**
- Critical: 6 use cases
- High: 15 use cases
- Medium: 8 use cases
- Low: 2 use cases

**Complexity Breakdown:**
- Low: 20 use cases
- Medium: 9 use cases
- High: 2 use cases (AI Chat, Live Scraping)

**Authentication Requirements:**
- Public (No auth): 5 use cases
- User (Auth required): 21 use cases
- Admin (Admin only): 5 use cases

### Implementation Coverage

**Implemented:** All 31 use cases ✅  
**Test Coverage:** 135 test cases defined  
**Business Rules:** 111 rules documented

### Key Findings

**Strengths:**
- Complete user authentication flow
- AI-powered conversational commerce
- Real-time product scraping
- Price tracking in wishlist
- Platform grouping for multi-marketplace carts
- Role-based access control

**Areas for Improvement:**
- No cascade delete for user deletion
- No confirmation emails (simulated only)
- No rate limiting on authentication endpoints
- Admin actions not logged
- No soft delete option
- No user activity tracking

---

**Document Status:** ✅ Complete  
**Last Updated:** December 2, 2025  
**Use Cases Documented:** 31  
**Test Cases Defined:** 135
