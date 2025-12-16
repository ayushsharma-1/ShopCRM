/**
 * AI Product Assistant
 * Conversational assistant for product discovery and questions
 */

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Global Shopping Assistant
 * Helps users discover products and navigate the store
 */
export async function askGlobalAssistant(userQuery, context) {
  if (!GROQ_API_KEY) {
    return 'AI assistant is currently unavailable. Please configure the API key.';
  }

  const { products, cart, currentRoute } = context;

  // Send ALL products but with minimal data (id, name, price, category only)
  // This covers entire catalog while keeping token usage low
  const allProductsSummary = products.map(p => ({
    id: p.id,
    name: p.name.slice(0, 40), // Truncate long names
    price: p.price,
    category: p.category
  }));

  // Extract price limit from query if present
  const priceMatch = userQuery.match(/(?:under|below|in|within|less than)\s*[₹]?\s*(\d+)/i);
  const maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;
  
  // Filter products by price if specified (still send all matches)
  const relevantProducts = maxPrice 
    ? allProductsSummary.filter(p => p.price <= maxPrice)
    : allProductsSummary;

  // Get cart details
  const cartDetails = cart.length > 0 
    ? cart.map(item => `${item.name} - ₹${item.price} x${item.quantity}`).join(', ')
    : 'Empty';

  const systemPrompt = `You are a shopping assistant. Be concise and direct—no emojis, no hype, no fluff.

Categories: Electronics, Clothing, Accessories, Home & Kitchen, Sports, Office, Health, Beauty, Automotive

Context:
- Current page: ${currentRoute}
- Cart items (${cart.length}): ${cartDetails}
- Total catalog: ${allProductsSummary.length} products
- Matching products: ${relevantProducts.length}

Price ranges: ₹10 - ₹10,000

Guidelines:
1. ALWAYS respond with product IDs at the end: [PRODUCTS:id1,id2,id3,id4]
2. Suggest 3-5 most relevant products
3. Keep description under 50 words
4. For cart queries, add: [ACTION:NAVIGATE:/cart]
5. Match products by: price, category, or name keywords

Example:
"Headphones under 500" → "Found 3 wireless options. [PRODUCTS:28,145,89]"

${maxPrice ? `${relevantProducts.length} products under ₹${maxPrice}` : `All ${relevantProducts.length} products`}:
${JSON.stringify(relevantProducts.slice(0, 100), null, 0)}`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || 'I apologize, but I couldn\'t process your request. Please try again.';
    
    // Extract product IDs if present
    const productMatch = responseText.match(/\[PRODUCTS:([\d,]+)\]/);
    const productIds = productMatch ? productMatch[1].split(',').map(id => parseInt(id.trim())) : [];
    const textOnly = responseText.replace(/\[PRODUCTS:[\d,]+\]/, '').trim();
    
    return {
      text: textOnly,
      productIds,
      products: productIds.map(id => products.find(p => p.id === id)).filter(Boolean)
    };
  } catch (error) {
    console.error('Global assistant error:', error);
    return {
      text: 'I\'m having trouble connecting right now. Please try again in a moment.',
      productIds: [],
      products: []
    };
  }
}

/**
 * Product-Specific Assistant
 * Answers questions about a specific product using only available data
 */
export async function askProductAssistant(userQuestion, context) {
  if (!GROQ_API_KEY) {
    return 'AI assistant is currently unavailable. Please configure the API key.';
  }

  const { product, reviews } = context;

  const systemPrompt = `You are a product information assistant. Your ONLY job is to answer questions about THIS specific product using ONLY the provided data.

Product Information:
${JSON.stringify({
  name: product.name,
  description: product.description,
  price: product.price,
  originalPrice: product.originalPrice,
  discount: product.discount,
  category: product.category,
  rating: product.rating,
  ratingCount: product.ratingCount,
  stock: product.stock,
  attributes: product.attributes,
  tags: product.tags,
  reviewsSummary: product.reviewsSummary
}, null, 2)}

Customer Reviews (${reviews.length} shown):
${reviews.length > 0 ? JSON.stringify(reviews, null, 2) : 'No reviews available'}

Rules:
1. Use only the data above—no guessing
2. Keep answers under 50 words
3. Use short, clear sentences
4. Include ₹ symbol for prices
5. If info is missing, say "I don't have that information"
6. No emojis, no hype`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuestion }
        ],
        temperature: 0.3,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I couldn\'t process your question. Please try asking differently.';
  } catch (error) {
    console.error('Product assistant error:', error);
    return 'I\'m having trouble right now. Please try again in a moment.';
  }
}

/**
 * Parse navigation actions from AI response
 */
export function parseNavigationAction(aiResponse) {
  if (!aiResponse) return { hasAction: false, cleanResponse: '' };
  
  const actionMatch = aiResponse.match(/\[ACTION:NAVIGATE:(.*?)\]/);
  if (actionMatch) {
    return {
      hasAction: true,
      route: actionMatch[1].trim(),
      cleanResponse: aiResponse.replace(/\[ACTION:NAVIGATE:.*?\]/g, '').trim()
    };
  }
  return { hasAction: false, route: null, cleanResponse: aiResponse };
}
