const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  
  try {
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('auth', JSON.stringify(state.auth));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return result;
};

export default localStorageMiddleware;