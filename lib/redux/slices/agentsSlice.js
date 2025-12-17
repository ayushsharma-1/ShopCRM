import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rules: [],
  lastTriggered: {},
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    addRule: (state, action) => {
      state.rules.push(action.payload);
    },
    updateRule: (state, action) => {
      const { ruleId, patch } = action.payload;
      const index = state.rules.findIndex(r => r.id === ruleId);
      if (index !== -1) {
        state.rules[index] = { ...state.rules[index], ...patch };
      }
    },
    removeRule: (state, action) => {
      state.rules = state.rules.filter(r => r.id !== action.payload);
      delete state.lastTriggered[action.payload];
    },
    setLastTriggered: (state, action) => {
      const { ruleId, timestamp } = action.payload;
      state.lastTriggered[ruleId] = timestamp;
    },
    toggleRule: (state, action) => {
      const { ruleId, active } = action.payload;
      const rule = state.rules.find(r => r.id === ruleId);
      if (rule) {
        rule.active = active !== undefined ? active : !rule.active;
      }
    },
  },
});

export const {
  addRule,
  updateRule,
  removeRule,
  setLastTriggered,
  toggleRule,
} = agentsSlice.actions;

export default agentsSlice.reducer;
