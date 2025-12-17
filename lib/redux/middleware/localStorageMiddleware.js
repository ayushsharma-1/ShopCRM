const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only save to localStorage on client side
  if (typeof window === 'undefined') {
    return result;
  }
  
  // Save cart, auth, agents, and addresses state to localStorage
  const state = store.getState();
  
  try {
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('auth', JSON.stringify(state.auth));
    localStorage.setItem('agents', JSON.stringify(state.agents));
    localStorage.setItem('addresses', JSON.stringify(state.addresses));
  } 
  catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return result;
};

export default localStorageMiddleware;
