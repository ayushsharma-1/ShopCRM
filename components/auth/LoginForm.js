'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';
import { loginSuccess } from '@/lib/redux/slices/authSlice';
import { loadCartFromDB } from '@/lib/redux/slices/cartSlice';
import { toast } from 'react-toastify';

const DEMO_USERS = [
  { email: 'admin@shop.com', password: 'admin123', name: 'adminCRM' },
  { email: 'dev@shop.com', password: 'dev123', name: 'devCRM' },
  { email: 'test@shop.com', password: 'test123', name: 'testCRM' },
];

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Call MongoDB login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(loginSuccess({ 
          userId: data.user.userId,
          email: data.user.email, 
          name: data.user.name
        }));
        
        // Load user's cart from MongoDB
        dispatch(loadCartFromDB(data.user.userId));
        
        toast.success(`Welcome back, ${data.user.name}!`);
        router.push('/products');
      } else {
        toast.error(data.error || 'Invalid email or password');
        setErrors({ password: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('[Login] Error:', error);
      toast.error('Login failed. Please try again.');
      setErrors({ password: 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (user) => {
    setFormData({ email: user.email, password: user.password });
  };

  return (
    <div className="w-full">
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200"
      >
        <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-3">
          Demo Credentials
        </h3>
        <div className="space-y-2">
          {DEMO_USERS.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 text-xs bg-white p-2.5 rounded-lg border border-neutral-200"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-900 truncate">{user.name}</p>
                <p className="text-neutral-500 truncate">{user.email} / {user.password}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDemoLogin(user)}
                className="shrink-0 text-neutral-900 hover:text-neutral-700 font-medium px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
