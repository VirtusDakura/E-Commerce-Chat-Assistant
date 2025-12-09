import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { cn } from '../../lib/utils';

const alertVariants = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <FiInfo className="w-5 h-5 text-blue-500" />,
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: <FiCheckCircle className="w-5 h-5 text-green-500" />,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: <FiAlertCircle className="w-5 h-5 text-red-500" />,
  },
};

const Alert = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  show = true,
  className,
  ...props
}) => {
  const config = alertVariants[variant];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'border rounded-lg p-4',
            config.container,
            className
          )}
          role="alert"
          {...props}
        >
          <div className="flex">
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="ml-3 flex-1">
              {title && (
                <h3 className="text-sm font-medium mb-1">{title}</h3>
              )}
              <div className="text-sm">{children}</div>
            </div>
            {dismissible && (
              <button
                type="button"
                className="flex-shrink-0 ml-3 inline-flex rounded-md p-1.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
                onClick={onDismiss}
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
