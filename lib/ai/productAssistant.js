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

  // Summarize products for context (show more relevant products)
  const productSummary = products.slice(0, 50).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    rating: p.rating
  }));

  // Extract price limit from query if present
  const priceMatch = userQuery.match(/(?:under|below|in|within|less than)\s*[₹]?\s*(\d+)/i);
  const maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;
  
  // Filter products by price if specified
  const relevantProducts = maxPrice 
    ? productSummary.filter(p => p.price <= maxPrice).slice(0, 20)
    : productSummary.slice(0, 15);

  // Get cart details
  const cartDetails = cart.length > 0 
    ? cart.map(item => `${item.name} - ₹${item.price} x${item.quantity}`).join(', ')
    : 'Empty';

  const systemPrompt = `You are a shopping assistant. Be concise and direct—no emojis, no hype, no fluff.

Categories: Electronics, Clothing, Accessories, Home & Kitchen, Sports, Office, Health, Beauty, Automotive

Context:
- Current page: ${currentRoute}
- Cart items (${cart.length}): ${cartDetails}
- Available products: ${productSummary.length}

Price ranges: ₹10 - ₹10,000 (when user says "in 500" or "under 500", they mean ₹500)

Guidelines:
1. Keep answers under 60 words
2. Use short, clear sentences
3. For cart/checkout navigation, respond with text + [ACTION:NAVIGATE:/cart]
4. For product suggestions, include IDs at end: [PRODUCTS:id1,id2,id3]
5. When asked about cart, list the items and offer to navigate
6. Suggest 3-4 products maximum

Example responses:
- "What's in my cart?" → "You have: [list items]. View your cart? [ACTION:NAVIGATE:/cart]"
- "Show electronics" → "Here are some electronics: [details] [PRODUCTS:1,5,12]"

${maxPrice ? `Products under ₹${maxPrice}:` : 'Product sample (prices in ₹):'}
${JSON.stringify(relevantProducts, null, 2)}`;

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
