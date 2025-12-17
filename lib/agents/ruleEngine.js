/**
 * Client-side rule engine for Agentic Commerce
 * Evaluates rules against current state and returns actionable events
 */

import { isRuleSnoozed } from './ruleUtils';

/**
 * Build product lookup map for O(1) access
 */
function buildProductMap(products) {
  const map = new Map();
  products.forEach(p => map.set(p.id, p));
  return map;
}

/**
 * Evaluate a single rule against context
 * Returns { matched: boolean, details: object }
 */
export function evaluateRule(rule, context) {
  const { products, cart, lastTriggered } = context;
  
  // Check if snoozed
  if (isRuleSnoozed(lastTriggered[rule.id], rule.snoozeHours)) {
    return { matched: false, details: { reason: 'snoozed' } };
  }

  const productMap = buildProductMap(products);
  const product = productMap.get(rule.productId);
  
  if (!product) {
    return { matched: false, details: { reason: 'product_not_found' } };
  }

  switch (rule.type) {
    case 'priceDrop':
      return evaluatePriceDrop(rule, product);
    
    case 'autoRestock':
      return evaluateAutoRestock(rule, product, cart);
    
    case 'cartReminder':
      return evaluateCartReminder(rule, cart);
    
    default:
      return { matched: false, details: { reason: 'unknown_type' } };
  }
}

/**
 * Evaluate price drop rule
 */
function evaluatePriceDrop(rule, product) {
  if (!rule.threshold) {
    return { matched: false, details: { reason: 'no_threshold' } };
  }

  if (product.price <= rule.threshold) {
    return {
      matched: true,
      details: {
        currentPrice: product.price,
        threshold: rule.threshold,
        product,
        message: `Price dropped to ₹${product.price} (target: ₹${rule.threshold})`,
      },
    };
  }

  return { matched: false, details: { reason: 'price_above_threshold' } };
}

/**
 * Evaluate auto-restock rule
 */
function evaluateAutoRestock(rule, product, cart) {
  const cartItem = cart.find(item => item.id === rule.productId);
  const currentQty = cartItem ? cartItem.quantity : 0;
  const restockQty = rule.restockQty || 1;

  // Trigger if item not in cart or below restock quantity
  if (currentQty < restockQty) {
    return {
      matched: true,
      details: {
        currentQty,
        restockQty,
        product,
        message: `Restock needed: ${product.name} (current: ${currentQty}, target: ${restockQty})`,
      },
    };
  }

  return { matched: false, details: { reason: 'stock_sufficient' } };
}

/**
 * Evaluate cart reminder rule
 */
function evaluateCartReminder(rule, cart) {
  const timeoutMs = (rule.timeoutHours || 24) * 60 * 60 * 1000;
  const createdTime = new Date(rule.createdAt).getTime();
  const elapsed = Date.now() - createdTime;

  if (elapsed >= timeoutMs) {
    const cartItem = cart.find(item => item.id === rule.productId);
    
    if (cartItem) {
      return {
        matched: true,
        details: {
          cartItem,
          elapsed: Math.floor(elapsed / (60 * 60 * 1000)),
          message: `Reminder: ${cartItem.name} has been in cart for ${Math.floor(elapsed / (60 * 60 * 1000))} hours`,
        },
      };
    }
  }

  return { matched: false, details: { reason: 'timeout_not_reached' } };
}

/**
 * Run all active rules and return actionable events
 * Safe to call from client - does not auto-dispatch
 */
export function runAllRules(store) {
  const state = store.getState();
  const { rules, lastTriggered } = state.agents || { rules: [], lastTriggered: {} };
  const products = state.products?.products || [];
  const cart = state.cart?.items || [];

  const activeRules = rules.filter(r => r.active);
  
  // Limit to 100 rules for prototype safety
  const rulesToEvaluate = activeRules.slice(0, 100);
  
  const actionableEvents = [];
  const context = { products, cart, lastTriggered };

  rulesToEvaluate.forEach(rule => {
    const result = evaluateRule(rule, context);
    
    if (result.matched) {
      actionableEvents.push({
        ruleId: rule.id,
        productId: rule.productId,
        actionType: rule.type,
        rule,
        ...result.details,
      });
    }
  });

  return actionableEvents;
}

/**
 * Trigger action for a rule (called after user confirmation)
 * Dispatches Redux actions based on rule type and action mode
 */
export async function triggerAction(rule, context, dispatch, user) {
  const { product, restockQty = 1 } = context;

  // Auto-order mode - place order directly
  if (rule.actionMode === 'auto_order') {
    // Auth guards for auto-order
    if (!user?.email) {
      return { success: false, error: 'User must be logged in for auto-order' };
    }

    if (!rule.userConsent) {
      return { success: false, error: 'User consent required for auto-order' };
    }

    if (!rule.addressId) {
      return { success: false, error: 'Delivery address required for auto-order' };
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email,
          items: [{
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: restockQty,
            image: product.image
          }],
          total: product.price * restockQty,
          addressId: rule.addressId,
          paymentMethod: 'Auto-Order',
          autoOrdered: true,
          agentRuleId: rule.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Auto-order failed');
      }

      // Update product stock in Redux
      if (result.updatedProducts) {
        dispatch({
          type: 'products/updateProductStock',
          payload: result.updatedProducts
        });
      }

      return { success: true, message: 'Auto-order placed successfully' };

    } catch (error) {
      console.error('Auto-order error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add to cart mode or notify mode
  if (rule.actionMode === 'add_to_cart' || !rule.actionMode || rule.actionMode === 'notify') {
    dispatch({
      type: 'cart/addItem',
      payload: {
        ...product,
        quantity: restockQty,
      },
    });
  }

  // Update last triggered timestamp
  dispatch({
    type: 'agents/setLastTriggered',
    payload: {
      ruleId: rule.id,
      timestamp: new Date().toISOString(),
    },
  });

  // Remove rule if not set to keep active
  if (!rule.keepActive) {
    dispatch({
      type: 'agents/removeRule',
      payload: rule.id,
    });
  }

  return { success: true };
}
