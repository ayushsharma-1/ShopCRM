import usersData from '@/data/users.json';
import reviewsData from '@/data/reviews.json';

/**
 * Get reviews for a specific product with user data merged
 * @param {number} productId - The product ID to filter reviews
 * @param {number} limit - Maximum number of reviews to return (default: all)
 * @returns {Array} Array of reviews with user data
 */
export function getProductReviews(productId, limit = null) {
  const productReviews = reviewsData.filter(
    (review) => review.productId === productId
  );

  // Merge user data with reviews
  const reviewsWithUsers = productReviews.map((review) => {
    const user = usersData.find((u) => u.id === review.userId);
    return {
      ...review,
      user: user || {
        id: 'unknown',
        name: 'Anonymous User',
        avatar: 'https://ui-avatars.com/api/?name=Anonymous&background=9CA3AF&color=fff'
      }
    };
  });

  // Apply limit if specified
  if (limit && limit > 0) {
    return reviewsWithUsers.slice(0, limit);
  }

  return reviewsWithUsers;
}

/**
 * Get reviews filtered by category
 * @param {string} category - Category to filter by (UI, Performance, Quality, Features, Support, Accessibility)
 * @param {number} limit - Maximum number of reviews to return
 * @returns {Array} Array of reviews with user data for the specified category
 */
export function getReviewsByCategory(category, limit = null) {
  const categoryReviews = reviewsData.filter(
    (review) => review.category === category
  );

  // Merge user data
  const reviewsWithUsers = categoryReviews.map((review) => {
    const user = usersData.find((u) => u.id === review.userId);
    return {
      ...review,
      user: user || {
        id: 'unknown',
        name: 'Anonymous User',
        avatar: 'https://ui-avatars.com/api/?name=Anonymous&background=9CA3AF&color=fff'
      }
    };
  });

  // Apply limit if specified
  if (limit && limit > 0) {
    return reviewsWithUsers.slice(0, limit);
  }

  return reviewsWithUsers;
}

/**
 * Get random reviews from a specific category
 * Uses stable randomization based on session to prevent React key issues
 * @param {string} category - Category to filter by
 * @param {number} count - Number of random reviews to return
 * @param {string} seed - Optional seed for consistent randomization (e.g., product ID)
 * @returns {Array} Array of random reviews with user data
 */
export function getRandomReviewsByCategory(category, count = 4, seed = null) {
  const categoryReviews = reviewsData.filter(
    (review) => review.category === category
  );

  // Merge user data
  const reviewsWithUsers = categoryReviews.map((review) => {
    const user = usersData.find((u) => u.id === review.userId);
    return {
      ...review,
      user: user || {
        id: 'unknown',
        name: 'Anonymous User',
        avatar: 'https://ui-avatars.com/api/?name=Anonymous&background=9CA3AF&color=fff'
      }
    };
  });

  // Stable shuffle using seed (or use array indices for stability)
  const shuffled = [...reviewsWithUsers];
  
  if (seed) {
    // Seed-based deterministic shuffle for consistent results per product
    const seedNum = typeof seed === 'string' ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : seed;
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(((seedNum * (i + 1)) % shuffled.length));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } else {
    // Simple shuffle without seed
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get all available review categories
 * @returns {Array} Array of unique category names
 */
export function getReviewCategories() {
  const categories = [...new Set(reviewsData.map((review) => review.category))];
  return categories.sort();
}

/**
 * Calculate average rating for a product
 * @param {number} productId - The product ID
 * @returns {number} Average rating rounded to 1 decimal place
 */
export function getAverageRating(productId) {
  const productReviews = reviewsData.filter(
    (review) => review.productId === productId
  );

  if (productReviews.length === 0) return 0;

  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / productReviews.length) * 10) / 10;
}

/**
 * Get review count for a product
 * @param {number} productId - The product ID
 * @returns {number} Total number of reviews
 */
export function getReviewCount(productId) {
  return reviewsData.filter((review) => review.productId === productId).length;
}

/**
 * Get rating distribution for a product
 * @param {number} productId - The product ID
 * @returns {Object} Object with rating counts (5: count, 4: count, etc.)
 */
export function getRatingDistribution(productId) {
  const productReviews = reviewsData.filter(
    (review) => review.productId === productId
  );

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  productReviews.forEach((review) => {
    distribution[review.rating] = (distribution[review.rating] || 0) + 1;
  });

  return distribution;
}

/**
 * Get user by ID
 * @param {string} userId - The user ID
 * @returns {Object|null} User object or null if not found
 */
export function getUserById(userId) {
  return usersData.find((user) => user.id === userId) || null;
}

/**
 * Format timestamp to relative time (e.g., "2 weeks ago")
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Relative time string
 */
export function formatRelativeTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
