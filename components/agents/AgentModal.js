'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Modal from '../common/Modal';
import { triggerAction } from '@/lib/agents/ruleEngine';
import { setLastTriggered } from '@/lib/redux/slices/agentsSlice';

export default function AgentModal({ isOpen, onClose, events, onEventDismiss }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleConfirm = (event) => {
    try {
      // Trigger the action
      triggerAction(event.rule, { product: event.product, restockQty: event.rule.restockQty || 1 }, dispatch);
      
      toast.success(`Action completed: ${event.message}`);
      
      // Close modal and remove event
      onEventDismiss(event.ruleId);
      
      // Navigate to checkout if it's a purchase action
      if (event.actionType === 'priceDrop') {
        setTimeout(() => {
          router.push('/cart');
        }, 500);
      }
    } catch (error) {
      toast.error('Failed to complete action');
      console.error('Agent action error:', error);
    }
  };

  const handleDismiss = (event) => {
    // Snooze the rule
    dispatch(setLastTriggered({
      ruleId: event.ruleId,
      timestamp: new Date().toISOString(),
    }));
    
    toast.info('Event snoozed for 24 hours');
    onEventDismiss(event.ruleId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agent Notifications" size="md">
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p className="text-sm">No pending agent notifications</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.ruleId} className="border border-neutral-200 rounded-xl p-4 space-y-3">
              {event.product && (
                <div className="flex gap-3">
                  <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                    <img
                      src={event.product.image || 'https://via.placeholder.com/64'}
                      alt={event.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-neutral-900 line-clamp-2">
                      {event.product.name}
                    </h4>
                    {event.currentPrice && (
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-semibold text-neutral-900">
                          ₹{event.currentPrice}
                        </span>
                        {event.threshold && (
                          <span className="text-xs text-neutral-500">
                            (target: ₹{event.threshold})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-sm text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg">
                {event.message}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm(event)}
                  className="flex-1 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors duration-150"
                >
                  {event.actionType === 'cartReminder' ? 'Proceed to Checkout' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => handleDismiss(event)}
                  className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors duration-150"
                >
                  Snooze 24h
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
