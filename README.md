# ShopHub - E-Commerce Application

A modern, feature-rich e-commerce application built with Next.js 14, React, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

### Authentication
- **Login & Signup** with demo credentials
- Session persistence using localStorage
- Protected routes for checkout
- Auto-redirect for authenticated users

### Product Management
- **Product Listing** with 30+ diverse products
- **Advanced Filtering:**
  - Search by name/description
  - Price range slider
  - Minimum rating filter
  - Category filter
- **Infinite Scroll** / Load More functionality
- **Product Details** page with full information

### Shopping Cart
- Add/Remove items
- Update quantities
- Real-time price calculations
- Free shipping on orders over $100
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

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Loading skeletons and spinners
- Toast notifications for user actions
- Smooth animations and transitions
- Clean, modern interface

## 📦 Technologies

- **Framework:** Next.js 14 (App Router)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **Notifications:** React Toastify
- **Language:** JavaScript

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
| Demo User | demo@shop.com | demo123 |
| John Doe | john@shop.com | john123 |
| Jane Smith | jane@shop.com | jane123 |

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
│   ├── products/                 # ProductCard, ProductFilters
│   ├── cart/                     # CartItem, CartSummary
│   ├── checkout/                 # AddressForm, PaymentForm, OrderSummary
│   ├── common/                   # Button, Input, Modal, etc.
│   └── layout/                   # Header, Footer
│
├── lib/                          # Business logic
│   ├── redux/
│   │   ├── slices/               # Redux slices
│   │   ├── middleware/           # localStorage middleware
│   │   └── store.js
│   └── hooks/                    # Custom hooks
│
├── data/                         # Static data
│   └── products.json             # 30 products
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

1. **authSlice** - User authentication state
2. **productsSlice** - Products and filters
3. **cartSlice** - Shopping cart items
4. **checkoutSlice** - Checkout form data
5. **uiSlice** - UI state (modals, loading)

### LocalStorage Persistence

- **Cart data** persists across sessions
- **Auth state** persists across sessions
- Automatically synced via Redux middleware

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
- **CartItem** - Individual cart item with quantity controls
- **CartSummary** - Order summary with calculations

### Checkout Components
- **StepIndicator** - Visual checkout progress
- **AddressForm** - Shipping information
- **PaymentForm** - Payment details (demo)
- **OrderSummary** - Final review before purchase

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

## 📝 Notes

- This is a **frontend-only demo** - no real backend
- Authentication is simulated with localStorage
- Payment is simulated (no real payment processing)
- Product images use Unsplash placeholder images
- All data is stored client-side

## 🎓 React Concepts Used

- ✅ Function Components
- ✅ Hooks (useState, useEffect, useSelector, useDispatch)
- ✅ Custom Hooks (useAuth, useCart)
- ✅ Redux Toolkit (createSlice, configureStore)
- ✅ Redux Middleware
- ✅ Context API (via Redux Provider)
- ✅ Conditional Rendering
- ✅ List Rendering with Keys
- ✅ Forms & Controlled Components
- ✅ Client-Side Routing (Next.js App Router)
- ✅ Route Groups
- ✅ Dynamic Routes
- ✅ Layouts
- ✅ Event Handling
- ✅ State Management (Local & Global)
- ✅ Side Effects
- ✅ Component Composition

## 🤝 Contributing

This is a learning project. Feel free to fork and modify as needed!

## 📄 License

MIT License - Free to use for learning purposes.

---

**Built with ❤️ using Next.js and React**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
