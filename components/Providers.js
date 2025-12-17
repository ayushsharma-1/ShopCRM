'use client';

import { Provider, useStore } from 'react-redux';
import { useEffect, useState } from 'react';
import { store } from '@/lib/redux/store';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from '@/components/common/ScrollToTop';
import AgentRunner from '@/components/agents/AgentRunner';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ScrollToTop />
      <AgentRunner />
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
}
