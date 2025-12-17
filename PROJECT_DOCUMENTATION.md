# Shop-CRM Project Documentation

## Project Overview
E-commerce platform built with Next.js 16 featuring AI-powered product search and shopping assistance.

---

## Tech Stack

### Core Framework
- **Next.js 16.0.10** - React framework with App Router
- **React 19.2.1** - UI library
- **Tailwind CSS 4** - Styling

### Database
- **MongoDB Atlas** - Cloud database (source of truth)
- **MongoDB Node.js Driver** - Native database driver
- **JSON Files** - Seed sources + fallback data

### State Management
- **Redux Toolkit 2.0.1** - Global state management
- **React Redux 9.2.0** - React bindings for Redux

### UI/UX Libraries
- **Framer Motion 12.23.26** - Animations
- **React Icons 5.0.1** - Icon library
- **React Toastify 10.0.3** - Notifications

### AI Integration
- **Groq API** - AI-powered search and assistant (llama-3.3-70b-versatile)

---

## Project Structure

```
Shop-CRM/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (shop)/                   # Main shop routes
│   │   ├── addresses/           # Saved addresses management
│   │   ├── agent-dashboard/     # Agent automation dashboard
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout process
│   │   ├── deals/[id]/          # Deal details
│   │   ├── order-confirmation/   # Order success page
│   │   └── products/            # Product pages
│   │       ├── [id]/            # Product details
│   │       └── page.js          # Products listing
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.js                  # Homepage
│
├── components/                   # React components
│   ├── agents/                  # Agent automation components
│   │   ├── AgentModal.js        # Actionable events display
│   │   └── AgentRunner.js       # Periodic rule evaluation
│   ├── auth/                    # Authentication components
│   │   ├── LoginForm.js
│   │   └── RegisterForm.js
│   ├── cart/                    # Cart components
│   │   ├── CartItem.js          # Includes auto-restock
│   │   └── CartSummary.js
│   ├── checkout/                # Checkout components
│   │   ├── AddressForm.js
│   │   ├── OrderReview.js
│   │   └── PaymentForm.js
│   ├── common/                  # Shared components
│   │   ├── LoadingSpinner.js
│   │   ├── Modal.js
│   │   ├── Pagination.js
│   │   └── ScrollToTop.js
│   ├── home/                    # Homepage sections
│   │   ├── BudgetSection.js
│   │   ├── CategorySection.js
│   │   ├── CTASection.js
│   │   ├── FeaturedDealsSection.js
│   │   ├── HeroSection.js
│   │   └── PromoBanner.js
│   ├── layout/                  # Layout components
│   │   ├── Footer.js
│   │   ├── Header.js            # Navigation + AI Assistant
│   │   └── header/              # Header subcomponents
│   ├── product/                 # Product display
│   │   ├── ProductActions.js
│   │   ├── ProductImageGallery.js
│   │   ├── ProductInfo.js
│   │   ├── ProductTabs.js
│   │   └── SimilarProducts.js
│   └── products/                # Product listing
│       ├── ProductCard.js
│       ├── ProductFilters.js    # Search + AI filters
│       ├── ProductGrid.js
│       └── ProductSort.js
│
├── data/                        # Static data
│   ├── deals.json              # Deal products (24 items)
│   ├── products.json           # Main products (210 items)
│   └── reviews.json            # Product reviews
│
├── lib/                         # Utilities and logic
│   ├── agents/                 # Agent automation system
│   │   ├── ruleEngine.js       # Rule evaluation engine
│   │   └── ruleUtils.js        # Rule utilities & schema
│   ├── ai/                     # AI integrations
│   │   ├── intentParser.js     # Natural language search parser
│   │   └── productAssistant.js # Shopping assistant AI
│   ├── redux/                  # Redux store
│   │   ├── slices/
│   │   │   ├── addressSlice.js  # Saved addresses state
│   │   │   ├── agentsSlice.js   # Agent rules state
│   │   │   ├── authSlice.js     # Authentication state
│   │   │   ├── cartSlice.js     # Shopping cart state
│   │   │   ├── checkoutSlice.js # Checkout state
│   │   │   └── productsSlice.js # Products + filters state
│   │   ├── middleware/
│   │   │   └── localStorageMiddleware.js # Persist cart, auth, agents, addresses
│   │   └── store.js            # Redux store config
│   └── utils/                  # Helper functions
│       ├── cartUtils.js
│       ├── formatters.js
│       └── reviewUtils.js
│
├── config/                      # Configuration
│   └── auth.js                 # Auth configuration
│
└── public/                      # Static assets
    └── images/
```

---

## Features Implementation

### 1. **AI-Powered Smart Search**
- **Location**: `lib/ai/intentParser.js`, `components/products/ProductFilters.js`
- **How it works**:
  - Natural language query parsing (e.g., "white shoes under 3000")
  - Extracts: category, price range, color, rating, keywords
  - Uses Groq API (llama-3.3-70b-versatile)
  - JSON-only responses with `response_format: json_object`
- **Features**:
  - Debounced search (400ms)
  - Real-time AI indicator
  - Visual filter breakdown
  - Searches in: name, description, tags, attributes, category

### 2. **AI Shopping Assistant**
- **Location**: `lib/ai/productAssistant.js`, `components/layout/Header.js`
- **Types**:
  - **Global Assistant**: Chat modal in header (robot icon)
  - **Product Q&A**: Product-specific questions on detail pages
- **Capabilities**:
  - Product recommendations with cards (image, price, discount)
  - Cart inquiry
  - Navigation suggestions
  - Price-based filtering
  - All 210 products in context (minimal data)
- **Tech**: 
  - Compact JSON (id, name, price, category only)
  - Product cards clickable to detail pages
  - Action buttons for navigation

### 3. **Authentication System**
- **Location**: `lib/redux/slices/authSlice.js`, `components/auth/`
- **Features**:
  - Login/Register forms
  - Redux-based state
  - Protected routes via middleware
  - Demo credentials: `demo@example.com` / `demo123`

### 4. **Shopping Cart**
- **Location**: `lib/redux/slices/cartSlice.js`, `components/cart/`
- **Features**:
  - Add/remove/update quantities
  - Persistent state (Redux)
  - Real-time total calculation
  - Empty cart detection

### 5. **Product Catalog**
- **Data**: 210 products + 24 deals
- **Features**:
  - Grid/list view
  - Filtering: category, price, rating, search
  - Sorting: price, rating, name
  - Pagination (12 items/page)
  - Product details with image gallery
  - Stock tracking
  - Rating display

### 6. **Deals System**
- **Location**: `data/deals.json`, `app/(shop)/deals/[id]/`
- **Features**:
  - String IDs (e.g., "deal_004")
  - Deal type badges
  - Countdown timers
  - Discount percentages
  - Supports both `/products/deal_004` and `/deals/deal_004`

### 7. **Checkout Flow**
- **Location**: `lib/redux/slices/checkoutSlice.js`, `components/checkout/`
- **Steps**:
  1. Address form
  2. Payment method selection
  3. Order review
  4. Order confirmation
- **Features**:
  - Multi-step wizard
  - Form validation
  - Order summary

### 8. **Reviews System**
- **Location**: `data/reviews.json`, `lib/utils/reviewUtils.js`
- **Features**:
  - Star ratings
  - Review text
  - User info
  - Average rating calculation
  - Review count

### 9. **Agentic Commerce System**
- **Location**: `lib/agents/`, `app/(shop)/agent-dashboard/`
- **Components**:
  - **Rule Engine**: Client-side evaluation every 5 minutes
  - **Agent Dashboard**: View, edit, delete automation rules
  - **Saved Addresses**: Manage delivery addresses for auto-order
- **Rule Types**:
  - **Price Drop**: Alert when product price falls below threshold
  - **Auto Restock**: Monitor inventory, notify when back in stock
  - **Cart Reminder**: Alert about items left in cart
- **Action Modes**:
  - `notify` - Show alert only (default)
  - `add_to_cart` - Automatically add item to cart
  - `auto_order` - Place order automatically (requires address + consent)
- **Features**:
  - User consent required for auto-order
  - Saved address selection mandatory for auto-order
  - Snooze functionality (24h default)
  - Keep active option (re-trigger after first match)
  - Toggle active/pause per rule
  - LocalStorage persistence
  - Bell icon notification badge
- **Locations**:
  - Product detail page: Set price alerts, auto-restock
  - Cart items: Per-item auto-restock
  - Dashboard: Manage all rules, edit permissions

### 10. **Address Management**
- **Location**: `app/(shop)/addresses/`, `lib/redux/slices/addressSlice.js`
- **Features**:
  - Add, edit, delete addresses
  - Set default address
  - Used for auto-order functionality
  - Full validation (letters only for names/cities, etc.)
- **Fields**: Full name, email, phone, street, city, state, ZIP, country
- **Storage**: Redux + localStorage persistence

### 11. **UI/UX Enhancements**
- **Animations**: Framer Motion for smooth transitions
- **Toasts**: React Toastify for notifications
- **Scroll to Top**: Auto-scroll on route change
- **Responsive**: Mobile-first design
- **Loading States**: Spinners and skeletons
- **Error Handling**: User-friendly messages
- **Dropdown Menu**: User menu with agent/address links
- **Modal System**: Reusable modals for forms and confirmations

---

## Key Modules

### Database Configuration
**MongoDB Atlas** - Primary data source
- Connection: Cached, pooled (2-10 connections)
- Collections: users, products, deals, reviews, addresses, agents, orders
- Seeding: Automatic on first boot from JSON files
- Fallback: JSON files used if MongoDB unavailable

**Collections:**
- `users` - Authentication, 163 reviews seeded
- `products` - 210 items with indexed fields
- `deals` - 24 deals with expiration dates
- `reviews` - Product reviews linked to products
- `addresses` - User delivery addresses
- `agents` - Agent automation rules
- `orders` - Order history including auto-orders

### API Routes
- `/api/auth/*` - Login, register (MongoDB)
- `/api/products` - Products/deals (MongoDB → JSON fallback)
- `/api/reviews` - Product reviews (MongoDB → JSON fallback)
- `/api/addresses` - CRUD for user addresses (MongoDB)
- `/api/agents` - CRUD for agent rules (MongoDB)
- `/api/orders` - Order management (MongoDB)

### Redux Slices
- **authSlice**: User authentication, MongoDB user IDs
- **cartSlice**: Cart items, quantities, totals
- **checkoutSlice**: Multi-step checkout state
- **productsSlice**: Products from MongoDB/JSON, filters, AI filters, sorting
- **agentsSlice**: Agent rules (syncs with MongoDB via API)
- **addressSlice**: Saved addresses (syncs with MongoDB via API)

### Data Files (Seed Sources)
- **products.json**: 210 products - seeds MongoDB on first boot
- **deals.json**: 24 deals - seeds MongoDB on first boot
- **reviews.json**: Product reviews - seeds MongoDB on first boot

### AI Implementation
- **Model**: llama-3.3-70b-versatile (Groq)
- **Temperature**: 0 (intent parser), 0.5 (assistant)
- **Max Tokens**: 100 (intent), 200 (assistant)
- **Response Format**: JSON object enforcement
- **Context**: All products (compact format)

---

## Routes

### Public Routes
- `/` - Homepage
- `/products` - Product listing
- `/products/[id]` - Product detail
- `/deals/[id]` - Deal detail
- `/login` - Login page
- `/register` - Register page

### Protected Routes (requires auth)
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/order-confirmation` - Order success
- `/agent-dashboard` - Agent automation & alerts management
- `/addresses` - Saved addresses management

---

## Environment Variables

**Required:**
- `NEXT_PUBLIC_GROQ_API_KEY` - Groq API key for AI features (get from https://console.groq.com/keys)
- `MONGODB_URI` - MongoDB Atlas connection string
- `MONGODB_DB_NAME` - Database name (ShopCRM)

---

## Design System

### Colors
- **Primary**: Neutral (grayscale)
- **Accent**: Slate (muted)
- **Actions**: Neutral-900 (black)
- **Errors**: Red-500
- **Success**: Green-500

### Typography
- **Font**: Geist Sans (system font stack)
- **Scale**: text-xs to text-3xl

### Spacing
- **Container**: max-w-7xl
- **Padding**: px-4, py-8
- **Gaps**: gap-2 to gap-12

### Animations
- **Duration**: 150-200ms (subtle)
- **Easing**: ease-out
- **Effects**: fade-in, scale, hover states

---

## Performance Optimizations

1. **MongoDB Connection Pooling**: Min 2, max 10 connections, cached across hot reloads
2. **Database Indexing**: Optimized queries on products, users, agents, addresses
3. **Debounced Search**: 400ms delay for AI parsing
4. **Agent Evaluation**: 500ms debounce, 5-minute intervals
5. **Lazy Loading**: Images with Next.js Image component
6. **Pagination**: 12 items per page
7. **Minimal AI Context**: Only essential product data
8. **Client Components**: Strategic use of 'use client'
9. **Scroll Optimization**: Auto-scroll to top on navigation
10. **LocalStorage Caching**: Cart, auth persisted (agents/addresses in MongoDB)
11. **Automatic Seeding**: Idempotent, runs only if collections empty
12. **JSON Fallback**: Seamless degradation if MongoDB unavailable

---

## Agent System Details

### Rule Schema
```javascript
{
  id: string,              // Unique rule identifier
  type: string,            // 'priceDrop' | 'autoRestock' | 'cartReminder'
  productId: number,       // Product to monitor
  threshold: number,       // Price threshold for priceDrop
  restockQty: number,      // Quantity for autoRestock
  timeoutHours: number,    // Hours for cartReminder (default: 24)
  active: boolean,         // Rule enabled/disabled
  keepActive: boolean,     // Continue after first trigger
  actionMode: string,      // 'notify' | 'add_to_cart' | 'auto_order'
  addressId: string,       // Selected address for auto_order
  userConsent: boolean,    // User consent for auto_order
  createdAt: string,       // ISO timestamp
  snoozeUntil: string,     // ISO timestamp (optional)
  snoozeHours: number      // Snooze duration (default: 24)
}
```

### Evaluation Flow
1. AgentRunner mounted at provider level
2. Periodic evaluation every 5 minutes
3. Debounced on cart/products state changes (500ms)
4. Rule engine checks active, non-snoozed rules
5. Events stored and displayed in header bell icon
6. User confirms/snoozes/dismisses in AgentModal
7. Actions executed only on user confirmation

### Address Validation Rules
- **Full Name**: Letters & spaces, min 2 chars
- **Email**: Standard email format
- **Phone**: Numbers + - ( ) spaces, 10-20 chars
- **Street**: Min 5 chars, any characters
- **City/State/Country**: Letters, spaces, hyphens only
- **ZIP Code**: Alphanumeric + hyphens, 4-10 chars

---

## Future Enhancements

### Data & Backend
- Order history and tracking system
- MongoDB Change Streams for real-time updates
- Atlas Search for full-text product search
- Aggregation pipelines for analytics dashboard
- Password hashing (bcrypt) and JWT authentication
- Backend API migration for production

### Features
- User profiles with order history
- Wishlist functionality
- Product comparisons
- Advanced filtering (multi-select)
- Real-time inventory updates via WebSocket
- Payment gateway integration
- Email/SMS notifications for agent triggers
- Product recommendations based on browsing history
- Machine learning for predictive restocking
- Analytics dashboard for rule performance

### Documentation
- See [MONGODB_MIGRATION.md](./MONGODB_MIGRATION.md) for complete database integration guide
