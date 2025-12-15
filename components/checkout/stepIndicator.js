'use client';

import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

export default function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, title: 'Address', description: 'Shipping details' },
    { number: 2, title: 'Payment', description: 'Payment method' },
    { number: 3, title: 'Review', description: 'Confirm order' },
  ];

  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-neutral-900 text-white'
                      : currentStep === step.number
                      ? 'bg-neutral-900 text-white ring-4 ring-neutral-200'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <FaCheck />
                    </motion.div>
                  ) : (
                    step.number
                  )}
                </div>
              </motion.div>
              <div className="mt-3 text-center hidden sm:block">
                <p
                  className={`text-sm font-medium transition-colors ${
                    currentStep >= step.number ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-neutral-100 mx-3 relative overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: currentStep > step.number ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-y-0 left-0 bg-neutral-900"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
