/**
 * MongoDB Collection Schemas (Plain JS Object Shapes)
 * No ODM - Native MongoDB collections
 */

/**
 * Users Collection
 * @typedef {Object} User
 * @property {ObjectId} _id - MongoDB auto-generated ID
 * @property {string} email - User email (unique)
 * @property {string} password - Plain password (PROTOTYPE ONLY)
 * @property {string} name - User full name
 * @property {Date} createdAt - Account creation timestamp
 */
export const UserSchema = {
  collection: 'users',
  indexes: [
    { key: { email: 1 }, unique: true }
  ]
};

/**
 * Products Collection
 * @typedef {Object} Product
 * @property {number} id - Product numeric ID (from JSON)
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {number} price - Product price
 * @property {number} originalPrice - Original price before discount
 * @property {number} discount - Discount percentage
 * @property {string} category - Product category
 * @property {string} image - Product image URL
 * @property {Array<string>} images - Additional product images
 * @property {number} stock - Available stock quantity
 * @property {number} rating - Average rating (0-5)
 * @property {number} reviewCount - Number of reviews
 * @property {Array<string>} tags - Product tags
 * @property {Object} attributes - Product attributes (color, size, etc.)
 * @property {Date} createdAt - Product creation timestamp
 */
export const ProductSchema = {
  collection: 'products',
  indexes: [
    { key: { id: 1 }, unique: true },
    { key: { category: 1 } },
    { key: { price: 1 } },
    { key: { rating: -1 } }
  ]
};

/**
 * Deals Collection
 * @typedef {Object} Deal
 * @property {string} id - Deal string ID (e.g., 'deal_004')
 * @property {string} name - Deal product name
 * @property {string} description - Deal description
 * @property {number} price - Deal price
 * @property {number} originalPrice - Original price before deal
 * @property {number} discount - Discount percentage
 * @property {string} category - Product category
 * @property {string} image - Deal image URL
 * @property {Array<string>} images - Additional images
 * @property {number} stock - Available stock
 * @property {number} rating - Average rating
 * @property {number} reviewCount - Review count
 * @property {string} dealType - Type of deal (flash, limited, seasonal)
 * @property {Date} dealEndDate - Deal expiration date
 * @property {Array<string>} tags - Deal tags
 * @property {Object} attributes - Deal attributes
 * @property {Date} createdAt - Deal creation timestamp
 */
export const DealSchema = {
  collection: 'deals',
  indexes: [
    { key: { id: 1 }, unique: true },
    { key: { dealEndDate: 1 } }
  ]
};

/**
 * Reviews Collection
 * @typedef {Object} Review
 * @property {number} id - Review numeric ID
 * @property {number} productId - Associated product ID
 * @property {string} userId - User ID who wrote review
 * @property {string} userName - User display name
 * @property {number} rating - Review rating (1-5)
 * @property {string} comment - Review text
 * @property {Date} date - Review date
 * @property {boolean} verified - Verified purchase
 * @property {Date} createdAt - Review creation timestamp
 */
export const ReviewSchema = {
  collection: 'reviews',
  indexes: [
    { key: { id: 1 }, unique: true },
    { key: { productId: 1 } },
    { key: { userId: 1 } }
  ]
};

/**
 * Addresses Collection
 * @typedef {Object} Address
 * @property {ObjectId} _id - MongoDB auto-generated ID
 * @property {string} userId - Associated user ID
 * @property {string} fullName - Recipient full name
 * @property {string} email - Contact email
 * @property {string} phone - Contact phone
 * @property {string} street - Street address
 * @property {string} city - City name
 * @property {string} state - State/province
 * @property {string} zipCode - ZIP/postal code
 * @property {string} country - Country name
 * @property {boolean} isDefault - Default address flag
 * @property {Date} createdAt - Address creation timestamp
 */
export const AddressSchema = {
  collection: 'addresses',
  indexes: [
    { key: { userId: 1 } },
    { key: { userId: 1, isDefault: 1 } }
  ]
};

/**
 * Agents Collection (Agent Rules)
 * @typedef {Object} Agent
 * @property {ObjectId} _id - MongoDB auto-generated ID
 * @property {string} userId - Associated user ID
 * @property {string} type - Rule type (priceDrop, autoRestock, cartReminder)
 * @property {number} productId - Product to monitor
 * @property {number} threshold - Price threshold for priceDrop
 * @property {number} restockQty - Quantity for autoRestock
 * @property {number} timeoutHours - Hours for cartReminder
 * @property {boolean} active - Rule enabled/disabled
 * @property {boolean} keepActive - Continue after first trigger
 * @property {string} actionMode - Action mode (notify, add_to_cart, auto_order)
 * @property {string} addressId - Selected address for auto_order
 * @property {boolean} userConsent - User consent for auto_order
 * @property {Date} createdAt - Rule creation timestamp
 * @property {Date} snoozeUntil - Snooze expiration timestamp
 * @property {number} snoozeHours - Snooze duration
 * @property {Date} lastTriggered - Last trigger timestamp
 */
export const AgentSchema = {
  collection: 'agents',
  indexes: [
    { key: { userId: 1 } },
    { key: { userId: 1, active: 1 } },
    { key: { productId: 1 } }
  ]
};

/**
 * Orders Collection (For agent auto-order prototype)
 * @typedef {Object} Order
 * @property {ObjectId} _id - MongoDB auto-generated ID
 * @property {string} userId - User who placed order
 * @property {Array<Object>} items - Order items [{productId, name, price, quantity}]
 * @property {number} total - Order total amount
 * @property {string} addressId - Delivery address ID
 * @property {string} status - Order status (pending, confirmed, shipped, delivered)
 * @property {string} paymentMethod - Payment method used
 * @property {boolean} autoOrdered - Created by agent automation
 * @property {string} agentRuleId - Associated agent rule ID (if auto-ordered)
 * @property {Date} createdAt - Order creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export const OrderSchema = {
  collection: 'orders',
  indexes: [
    { key: { userId: 1 } },
    { key: { status: 1 } },
    { key: { autoOrdered: 1 } },
    { key: { createdAt: -1 } }
  ]
};

/**
 * Carts Collection (User shopping carts)
 * @typedef {Object} Cart
 * @property {ObjectId} _id - MongoDB auto-generated ID
 * @property {string} userId - Associated user ID
 * @property {Array<Object>} items - Cart items [{productId, name, price, quantity, image}]
 * @property {Date} createdAt - Cart creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export const CartSchema = {
  collection: 'carts',
  indexes: [
    { key: { userId: 1 }, unique: true }
  ]
};

/**
 * Get all collection schemas
 */
export const ALL_SCHEMAS = {
  users: UserSchema,
  products: ProductSchema,
  deals: DealSchema,
  reviews: ReviewSchema,
  addresses: AddressSchema,
  agents: AgentSchema,
  orders: OrderSchema,
  carts: CartSchema
};

/**
 * Collection names
 */
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  DEALS: 'deals',
  REVIEWS: 'reviews',
  ADDRESSES: 'addresses',
  AGENTS: 'agents',
  ORDERS: 'orders',
  CARTS: 'carts'
};
