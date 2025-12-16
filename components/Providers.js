'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from '@/components/common/ScrollToTop';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ScrollToTop />
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
