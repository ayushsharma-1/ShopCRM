# ShopCRM - E-Commerce Application

A modern, feature-rich e-commerce application built with Next.js 16, React 19, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

### Authentication
- **Login & Signup** with demo credentials
- Session persistence using localStorage
- Protected routes for checkout
- Auto-redirect for authenticated users

### Product Management
- **Product Listing** with 100 diverse products across 10 categories
- **Advanced Filtering:**
  - Search by name/description
  - Price range slider (₹0 - ₹10,000)
  - Minimum rating filter (1-5 stars)
  - Category filter (Electronics, Clothing, Home & Kitchen, Books, Toys, Sports, Beauty, Automotive, Garden, Office)
- **Load More** pagination functionality
- **Product Details** page with:
  - Full product information
  - Image gallery
  - Size/color/variant selection
  - Add to cart with quantity
  - Product reviews and ratings
  - Similar products recommendations

### Shopping Cart
- Add/Remove items
- Update quantities
- Real-time price calculations
- Free shipping on orders over ₹100
- Persistent cart (localStorage)
- **Guest users can browse and add to cart**

### Checkout Process
- **3-Step Checkout Wizard:**
  1. Shipping Address Form
  2. Payment Details Form
  3. Order Summary & Confirmation
- Form validation at each step
- Sequential navigation with back button
- Order success confirmation
- **Requires authentication**

### Reviews & Ratings
- **Product Reviews** with user profiles
- **Review Categories:** Quality, Performance, Features, Support, UI, Accessibility
- Verified purchase badges
- Star ratings (1-5)
- User avatars and names
- Timestamp display
- Review filtering by category

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Loading skeletons and spinners
- Toast notifications for user actions
- Smooth animations with Framer Motion
- Font Awesome icons throughout
- Clean, modern interface with Tailwind CSS
- Sticky filters sidebar on products page
- Mobile-friendly drawer navigation

## 📦 Technologies

- **Framework:** Next.js 16 (App Router)
- **React:** 19.2.1
- **State Management:** Redux Toolkit 2.0.1
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** React Icons (Font Awesome)
- **Notifications:** React Toastify
- **Build Tool:** Turbopack
- **Language:** JavaScript (ES6+)

## 🛠️ Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

You can use any of these credentials to login:

| Name | Email | Password |
|------|-------|----------|
| adminCRM | admin@shop.com | admin123 |
| devCRM | dev@shop.com | dev123 |
| testCRM | test@shop.com | test123 |

**Or create a new account** - Any email format and password (min 6 chars) works!

## 📁 Project Structure

```
ecommerce/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── (shop)/                   # Shop route group
│   │   ├── products/
│   │   │   └── [id]/
│   │   ├── cart/
│   │   └── checkout/
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Home page
│   └── globals.css
│
├── components/                   # React components
│   ├── auth/                     # LoginForm, SignupForm
│   ├── products/                 # ProductCard, ProductFilters, ProductGrid
│   ├── cart/                     # CartItem, CartSummary, CartHeader, CartItemsList
│   ├── checkout/                 # AddressForm, PaymentForm, OrderSummary, StepIndicator
│   ├── common/                   # Button, Input, Modal, LoadingSpinner, Skeleton
│   ├── home/                     # HeroSection, CategorySection, FeaturedDealsSection, etc.
│   ├── layout/                   # Header, Footer
│   │   ├── header/               # CartButton, Logo, MobileMenu, NavLink, UserMenu
│   │   └── footer/               # FooterLink, FooterSection
│   ├── product/                  # ProductImageGallery, ProductInfo, ProductActions, ProductTabs
│   │   └── options/              # ColorSelector, SizeSelector, OptionRenderer
│   └── Providers.js              # Redux Provider wrapper
│
├── lib/                          # Business logic
│   ├── redux/
│   │   ├── slices/               # Redux slices (auth, cart, checkout, products, ui)
│   │   ├── middleware/           # localStorage middleware
│   │   └── store.js
│   └── utils/                    # Utility functions
│       └── reviewUtils.js        # Review filtering and merging utilities
│
├── data/                         # Static data
│   ├── products.json             # 100 products across 10 categories
│   ├── users.json                # 55 user profiles for reviews
│   └── reviews.json              # 55 product reviews
│
└── public/                       # Static assets
```

## 🎯 Key Features Explained

### Guest vs Authenticated User Flow

#### Guest Users Can:
- ✅ Browse all products
- ✅ Search and filter products
- ✅ View product details
- ✅ Add items to cart
- ✅ View cart
- ❌ Cannot proceed to checkout (redirected to login)

#### Authenticated Users Can:
- ✅ All guest features PLUS
- ✅ Complete checkout process
- ✅ Place orders
- ✅ Persistent profile

### Redux State Management

The app uses Redux Toolkit for state management with 5 slices:

1. **authSlice** - User authentication state (login, signup, logout, session persistence)
2. **productsSlice** - Products and filters (search, category, price range, rating, pagination)
3. **cartSlice** - Shopping cart items (add, remove, update quantity, auto-calculate totals)
4. **checkoutSlice** - Checkout form data (address, payment, order processing)
5. **uiSlice** - UI state (modals, loading, mobile menu)

### LocalStorage Persistence

- **Cart data** persists across sessions
- **Auth state** persists across sessions
- Automatically synced via Redux middleware
- Survives page refreshes and browser restarts

### Utility Functions

#### Review Utilities (`lib/utils/reviewUtils.js`)
- **getProductReviews(productId, limit)** - Fetch reviews for a specific product with user data merged
- **getReviewsByCategory(category, limit)** - Filter reviews by category (Quality, Performance, etc.)
- **getRandomReviewsByCategory(category, count, seed)** - Get random reviews with optional seeding for consistency
- **getReviewCategories()** - Get all available review categories

These utilities automatically merge user data (name, avatar) with reviews for display.

## 🎨 UI Components

### Common Components
- **Button** - Multiple variants (primary, secondary, danger, outline, ghost)
- **Input** - Form input with validation
- **Modal** - Reusable modal with backdrop
- **LoadingSpinner** - Loading indicators
- **Skeleton** - Loading placeholders

### Product Components
- **ProductCard** - Product display card
- **ProductFilters** - Search, price, rating, category filters
- **ProductGrid** - Responsive product layout

### Cart Components
- **CartItem** - Individual cart item with quantity controls, image, price
- **CartSummary** - Order summary with subtotal, shipping, tax, total calculations
- **CartHeader** - Cart page header with item count
- **CartItemsList** - Animated list with Framer Motion transitions
- **EmptyCart** - Empty state with "Start Shopping" call-to-action

### Checkout Components
- **StepIndicator** - Visual progress indicator with 3 steps (Address → Payment → Review)
- **AddressForm** - Full shipping form with email, phone, address validation
- **PaymentForm** - Card number formatting, expiry date (MM/YY), CVV masking
- **OrderSummary** - Final review with all items, shipping details, payment info
- **OrderConfirmation** - Success animation and confirmation message
- **CheckoutSection** - Reusable section wrapper with styling

### Products Components
- **ProductCard** - Card with image, name, price, rating, "Add to Cart" button
- **ProductFilters** - Sidebar with search, category, price range, rating filters
- **ProductGrid** - Responsive grid (1-4 columns) with loading skeletons
- **ProductsHeader** - Header with filter toggle and product count
- **LoadMoreButton** - "Load More" button with loading state
- **EmptyState** - "No products found" message with filter reset option
- **SortDropdown** - Sort by price, rating, name (currently not active)

### Product Detail Components
- **ProductImageGallery** - Main image with thumbnail gallery
- **ProductInfo** - Product name, price, rating, description, stock status
- **ProductActions** - Quantity selector, size/color options, "Add to Cart"
- **ProductTabs** - Tabbed interface: Description, Specifications, Reviews
- **ReviewCard** - Review with user avatar, name, rating, timestamp, verified badge
- **SimilarProducts** - Horizontal scrollable list of related products
- **OptionRenderer** - Dynamic options handler for size/color/variants
- **ColorSelector** - Color swatch picker
- **SizeSelector** - Size button selector
- **GenericSelector** - Generic dropdown for other options

### Home Page Components
- **HeroSection** - Hero banner with CTA buttons and background image
- **CategorySection** - Category cards with images and product counts
- **FeaturedDealsSection** - Featured products carousel
- **BudgetSection** - Budget-friendly products showcase
- **CTASection** - Call-to-action banner
- **PromoBanner** - Promotional banner with countdown

### Layout Components
- **Header** - Main navigation with logo, search, cart, user menu
- **Footer** - Footer with links, social media, newsletter
- **CartButton** - Cart icon with item count badge
- **Logo** - Clickable site logo
- **MobileMenu** - Responsive mobile navigation drawer
- **NavLink** - Active navigation link component
- **UserMenu** - User dropdown with login/logout
- **FooterLink** - Styled footer link
- **FooterSection** - Footer section with heading

## 📱 Responsive Design

- **Mobile:** Single column layout
- **Tablet:** 2-column grid
- **Desktop:** 3-4 column grid with sidebar

## 🔔 Toast Notifications

User feedback for all actions:
- ✅ Success: Login, signup, add to cart, order placed
- ℹ️ Info: Cart empty, item removed
- ⚠️ Warning: Login required, stock limits
- ❌ Error: Invalid credentials, validation errors

## 🚀 Development

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## � Data Structure

### Products (`data/products.json`)
100 products with:
- Unique ID, name, description
- Price, category, rating
- Image URL (Unsplash)
- Stock quantity
- Categories: Electronics, Clothing, Home & Kitchen, Books, Toys, Sports, Beauty, Automotive, Garden, Office

### Users (`data/users.json`)
55 users with:
- Unique ID
- Name
- Avatar URL (UI Avatars API)

### Reviews (`data/reviews.json`)
55 reviews with:
- Review ID, user ID, product ID
- Rating (1-5 stars)
- Category (Quality, Performance, Features, Support, UI, Accessibility)
- Review text
- Timestamp
- Verified purchase flag

## 📝 Notes

- This is a **frontend-only demo** - no real backend
- Authentication is simulated with localStorage
- Payment is simulated (no real payment processing)
- Product images use Unsplash placeholder images
- User avatars generated via UI Avatars API
- All data is stored client-side
- Demo uses static JSON files for products, users, and reviews

## 🎓 React & Next.js Concepts Used

### React Core
- ✅ Function Components
- ✅ Hooks (useState, useEffect, useSelector, useDispatch, useParams, useRouter)
- ✅ Custom Hooks
- ✅ Conditional Rendering
- ✅ List Rendering with Keys
- ✅ Forms & Controlled Components
- ✅ Event Handling
- ✅ Component Composition
- ✅ Props & PropTypes

### State Management
- ✅ Redux Toolkit (createSlice, configureStore)
- ✅ Redux Middleware (localStorage sync)
- ✅ Context API (via Redux Provider)
- ✅ Local State (useState)
- ✅ Global State (Redux)

### Next.js Features
- ✅ App Router (Next.js 16)
- ✅ Client Components ('use client')
- ✅ Server Components
- ✅ Route Groups ((auth), (shop))
- ✅ Dynamic Routes ([id])
- ✅ Layouts (root layout, route group layouts)
- ✅ next/navigation (useRouter, useParams, useSearchParams)
- ✅ Suspense Boundaries for useSearchParams
- ✅ Turbopack (Fast Refresh)

### Advanced Patterns
- ✅ Utility Functions (reviewUtils)
- ✅ JSON Data Import
- ✅ Side Effects (useEffect)
- ✅ Debouncing
- ✅ Pagination (Load More)
- ✅ Form Validation
- ✅ Error Handling
- ✅ Loading States
- ✅ Animation (Framer Motion)
- ✅ Toast Notifications

## 🤝 Contributing

This is a learning project. Feel free to fork and modify as needed!
