'use client';

import { useEffect, useState, useCallback } from 'react';
import { useStore } from 'react-redux';
import { runAllRules } from '@/lib/agents/ruleEngine';

let evaluationTimeout = null;

export default function AgentRunner() {
  const store = useStore();
  const [, forceUpdate] = useState(0);

  // Debounced evaluation
  const scheduleEvaluation = useCallback(() => {
    if (evaluationTimeout) {
      clearTimeout(evaluationTimeout);
    }
    
    evaluationTimeout = setTimeout(() => {
      try {
        runAllRules(store);
        forceUpdate(n => n + 1);
      } catch (error) {
        console.error('Agent evaluation error:', error);
      }
    }, 500);
  }, [store]);

  useEffect(() => {
    // Initial evaluation on mount
    scheduleEvaluation();

    // Periodic evaluation every 5 minutes
    const interval = setInterval(() => {
      scheduleEvaluation();
    }, 5 * 60 * 1000);

    // Subscribe to cart and products changes
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      // Only trigger on relevant changes
      if (state.cart || state.products) {
        scheduleEvaluation();
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
      if (evaluationTimeout) {
        clearTimeout(evaluationTimeout);
      }
    };
  }, [store, scheduleEvaluation]);

  return null;
}
