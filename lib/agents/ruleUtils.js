/**
 * Rule utilities for Agentic Commerce
 */

export const RULE_SCHEMA = {
  id: null,
  type: null, // "priceDrop" | "autoRestock" | "cartReminder"
  productId: null,
  threshold: null,
  restockQty: null,
  timeoutHours: null,
  active: true,
  createdAt: null,
  keepActive: false,
  snoozeHours: 24,
  actionMode: 'notify', // "notify" | "add_to_cart" | "auto_order"
  addressId: null,
  userConsent: false,
};

/**
 * Generate unique rule ID
 */
export function generateRuleId() {
  return `rule_${Date.now()}`;
}

/**
 * Normalize rule payload with defaults
 */
export function normalizeRulePayload(raw) {
  return {
    ...RULE_SCHEMA,
    ...raw,
    id: raw.id || generateRuleId(),
    createdAt: raw.createdAt || new Date().toISOString(),
    active: raw.active !== undefined ? raw.active : true,
    keepActive: raw.keepActive !== undefined ? raw.keepActive : false,
    snoozeHours: raw.snoozeHours || 24,
    actionMode: raw.actionMode || 'notify',
    addressId: raw.addressId || null,
    userConsent: raw.userConsent || false,
  };
}

/**
 * Infer defaults from product data
 */
export function inferDefaults(product) {
  return {
    color: product.attributes?.color || null,
    tags: product.tags || [],
    category: product.category || null,
  };
}

/**
 * Check if rule should be snoozed
 */
export function isRuleSnoozed(lastTriggered, snoozeHours) {
  if (!lastTriggered) return false;
  
  const lastTime = new Date(lastTriggered).getTime();
  const now = Date.now();
  const snoozeDuration = snoozeHours * 60 * 60 * 1000;
  
  return (now - lastTime) < snoozeDuration;
}
