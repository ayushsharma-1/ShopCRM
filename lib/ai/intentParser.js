/**
 * AI Intent Parser for Natural Language Product Search
 * Converts free-text queries into structured filter objects using Groq API
 */

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Cache for recent AI queries to reduce API calls
const intentCache = new Map();
const CACHE_MAX_SIZE = 50;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Parse natural language query into structured filters
 * @param {string} query - User's natural language search query
 * @returns {Promise<Object|null>} Parsed filter object or null if parsing fails
 */
export async function parseSearchIntent(query) {
  if (!query || query.length < 3) return null;

  // Check cache first
  const cacheKey = query.toLowerCase().trim();
  const cached = intentCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // If no API key, return null to fallback to traditional search
  if (!GROQ_API_KEY) {
    console.warn('GROQ_API_KEY not found. AI search disabled. Using traditional search.');
    return null;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a product search intent parser. Convert natural language queries into structured JSON filters.

Available categories: Electronics, Clothing, Accessories, Home & Kitchen, Sports, Office, Health

Rules:
- Return ONLY valid JSON, no markdown or explanations
- All fields are optional
- Price should be in numbers without currency symbols
- Rating should be 0-5
- Color should be lowercase
- Keywords should be an array of relevant search terms

Output format:
{
  "category": "string or null",
  "maxPrice": number or null,
  "minRating": number or null,
  "color": "string or null",
  "keywords": ["string"] or null
}

Examples:
"black shoes under 3000" → {"color": "black", "maxPrice": 3000, "keywords": ["shoes"]}
"good headphones" → {"minRating": 4, "keywords": ["headphones"]}
"cheap electronics" → {"category": "Electronics", "maxPrice": 500}
"blue shirt" → {"color": "blue", "keywords": ["shirt"]}
"laptop for work" → {"keywords": ["laptop", "work"]}
"high rated office supplies" → {"category": "Office", "minRating": 4.5}`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.1,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse and validate JSON response
    const parsed = JSON.parse(content);
    const validated = validateIntentObject(parsed);

    // Cache the result
    if (intentCache.size >= CACHE_MAX_SIZE) {
      const firstKey = intentCache.keys().next().value;
      intentCache.delete(firstKey);
    }
    intentCache.set(cacheKey, { data: validated, timestamp: Date.now() });

    return validated;
  } catch (error) {
    console.error('AI intent parsing failed:', error);
    return null;
  }
}

/**
 * Validate and sanitize AI-parsed intent object
 */
function validateIntentObject(obj) {
  const validated = {};

  // Validate category
  const validCategories = ['Electronics', 'Clothing', 'Accessories', 'Home & Kitchen', 'Sports', 'Office', 'Health'];
  if (obj.category && validCategories.includes(obj.category)) {
    validated.category = obj.category;
  }

  // Validate price (must be positive number)
  if (obj.maxPrice && typeof obj.maxPrice === 'number' && obj.maxPrice > 0) {
    validated.maxPrice = Math.min(obj.maxPrice, 100000); // Cap at reasonable max
  }

  // Validate rating (0-5)
  if (obj.minRating && typeof obj.minRating === 'number') {
    validated.minRating = Math.max(0, Math.min(5, obj.minRating));
  }

  // Validate color (should be string, lowercase)
  if (obj.color && typeof obj.color === 'string') {
    validated.color = obj.color.toLowerCase().trim();
  }

  // Validate keywords (array of strings)
  if (obj.keywords && Array.isArray(obj.keywords)) {
    validated.keywords = obj.keywords
      .filter(k => typeof k === 'string' && k.length > 0)
      .map(k => k.toLowerCase().trim())
      .slice(0, 5); // Max 5 keywords
  }

  return Object.keys(validated).length > 0 ? validated : null;
}

/**
 * Calculate relevance score for product based on AI-parsed filters
 * Higher score = better match
 */
export function calculateRelevanceScore(product, aiFilters) {
  if (!aiFilters || !product) return 0;

  let score = 0;

  // Category match (highest priority)
  if (aiFilters.category && product.category === aiFilters.category) {
    score += 100;
  }

  // Color match (high priority)
  if (aiFilters.color && product.attributes?.color) {
    if (product.attributes.color.toLowerCase() === aiFilters.color) {
      score += 50;
    }
  }

  // Keywords match (medium priority)
  if (aiFilters.keywords && aiFilters.keywords.length > 0) {
    const productText = `${product.name} ${product.description} ${product.tags?.join(' ')}`.toLowerCase();
    
    aiFilters.keywords.forEach(keyword => {
      if (productText.includes(keyword)) {
        score += 20;
      }
    });
  }

  // Rating boost (slight priority)
  if (product.rating >= 4.5) {
    score += 10;
  } else if (product.rating >= 4.0) {
    score += 5;
  }

  // Price proximity (if maxPrice specified)
  if (aiFilters.maxPrice) {
    if (product.price <= aiFilters.maxPrice) {
      // Closer to target price = better score
      const priceRatio = product.price / aiFilters.maxPrice;
      score += Math.round((1 - priceRatio) * 10);
    }
  }

  return score;
}

/**
 * Clear the intent cache (useful for testing or manual reset)
 */
export function clearIntentCache() {
  intentCache.clear();
}
