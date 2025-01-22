import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'react-feather';

const Alert = ({ variant = 'info', message, onClose }) => {
  const variants = {
    success: {
      containerClass: 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    },
    error: {
      containerClass: 'bg-red-900/30 border-red-500/50 text-red-300',
      icon: <XCircle className="w-5 h-5 text-red-400" />,
    },
    warning: {
      containerClass: 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    },
    info: {
      containerClass: 'bg-blue-900/30 border-blue-500/50 text-blue-300',
      icon: <Info className="w-5 h-5 text-blue-400" />,
    },
  };

  const { containerClass, icon } = variants[variant];

  return (
    <div className={`relative flex items-center gap-3 p-4 rounded-lg border ${containerClass} animate-slideIn`}>
      {icon}
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;