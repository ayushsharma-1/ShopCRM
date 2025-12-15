/**
 * Product Options Configuration
 * Maps categories to their available product options
 * Supports scalable addition of new options and categories
 */

// Available option definitions
export const OPTION_TYPES = {
  COLOR: 'color',
  SIZE: 'size',
  MATERIAL: 'material',
  STORAGE: 'storage'
};

// Option data and configurations
export const OPTIONS_DATA = {
  [OPTION_TYPES.COLOR]: {
    label: 'Color',
    choices: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Blue', value: '#3B82F6' },
      { name: 'Gray', value: '#6B7280' },
      { name: 'Red', value: '#EF4444' }
    ],
    defaultValue: 'Black'
  },
  [OPTION_TYPES.SIZE]: {
    label: 'Size',
    choices: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    defaultValue: 'M'
  },
  [OPTION_TYPES.MATERIAL]: {
    label: 'Material',
    choices: ['Cotton', 'Polyester', 'Leather', 'Synthetic', 'Wool'],
    defaultValue: 'Cotton'
  },
  [OPTION_TYPES.STORAGE]: {
    label: 'Storage',
    choices: ['64GB', '128GB', '256GB', '512GB', '1TB'],
    defaultValue: '128GB'
  }
};

// Category to options mapping
export const CATEGORY_OPTIONS = {
  // Clothing items - color and size options
  clothing: [OPTION_TYPES.COLOR, OPTION_TYPES.SIZE],
  
  // Electronics - color options for devices
  electronics: [OPTION_TYPES.COLOR],
  
  // Accessories - color options for bags, watches, etc.
  accessories: [OPTION_TYPES.COLOR],
  
  // Home & Kitchen - color options for decorative items
  'home & kitchen': [OPTION_TYPES.COLOR],
  
  // Sports - size and color options for gear and apparel
  sports: [OPTION_TYPES.COLOR, OPTION_TYPES.SIZE],
  
  // Office - no customization options
  office: [],
  
  // Health - no customization options for supplements
  health: [],
  
  // Easily extendable for new categories
  // smartphones: [OPTION_TYPES.COLOR, OPTION_TYPES.STORAGE],
  // furniture: [OPTION_TYPES.MATERIAL, OPTION_TYPES.COLOR],
};

/**
 * Get available options for a product category
 * @param {string} category - Product category
 * @returns {Array} Array of option type strings
 */
export function getOptionsForCategory(category) {
  const normalizedCategory = category?.toLowerCase();
  return CATEGORY_OPTIONS[normalizedCategory] || [];
}

/**
 * Get option configuration by type
 * @param {string} optionType - Option type from OPTION_TYPES
 * @returns {Object} Option configuration object
 */
export function getOptionConfig(optionType) {
  return OPTIONS_DATA[optionType];
}

/**
 * Check if category has specific option
 * @param {string} category - Product category
 * @param {string} optionType - Option type to check
 * @returns {boolean} True if category has the option
 */
export function categoryHasOption(category, optionType) {
  const options = getOptionsForCategory(category);
  return options.includes(optionType);
}
