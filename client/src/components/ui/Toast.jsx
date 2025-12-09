import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { cn } from '../../lib/utils';

const toastVariants = {
  info: {
    container: 'bg-white border-l-4 border-blue-500',
    icon: <FiInfo className="w-5 h-5 text-blue-500" />,
  },
  success: {
    container: 'bg-white border-l-4 border-green-500',
    icon: <FiCheckCircle className="w-5 h-5 text-green-500" />,
  },
  warning: {
    container: 'bg-white border-l-4 border-yellow-500',
    icon: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />,
  },
  error: {
    container: 'bg-white border-l-4 border-red-500',
    icon: <FiAlertCircle className="w-5 h-5 text-red-500" />,
  },
};

const Toast = ({
  id,
  variant = 'info',
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const config = toastVariants[variant];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className={cn(
        'w-80 rounded-lg shadow-lg p-4',
        config.container
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">{config.icon}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-medium text-gray-900">{title}</p>
          )}
          {message && (
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          )}
        </div>
        <button
          onClick={() => onClose?.(id)}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

// Internal state for toast management
let toastListeners = [];
let toastState = [];

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener(toastState));
};

// Global toast functions
export const toast = {
  _addToast: (toastData) => {
    const id = Math.random().toString(36).substr(2, 9);
    toastState = [...toastState, { id, ...toastData }];
    notifyListeners();
    return id;
  },
  _removeToast: (id) => {
    toastState = toastState.filter((t) => t.id !== id);
    notifyListeners();
  },
  info: (title, message) => toast._addToast({ variant: 'info', title, message }),
  success: (title, message) => toast._addToast({ variant: 'success', title, message }),
  warning: (title, message) => toast._addToast({ variant: 'warning', title, message }),
  error: (title, message) => toast._addToast({ variant: 'error', title, message }),
};

// Toast Container Component - manages its own state
export const ToastContainer = () => {
  const [toasts, setToasts] = useState(() => [...toastState]);

  useEffect(() => {
    // Subscribe to toast state changes
    const listener = (newToasts) => setToasts([...newToasts]);
    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const handleClose = useCallback((id) => {
    toast._removeToast(id);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={handleClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for using toast (optional, can use toast directly)
export const useToast = () => {
  return { toast };
};

export default Toast;
