import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  // simple queue to avoid dropping rapid toasts
  const queueRef = useRef([]);

  const processQueue = useCallback(() => {
    if (open) return;
    const next = queueRef.current.shift();
    if (next) {
      setMessage(next.message);
      setSeverity(next.severity || 'info');
      setOpen(true);
    }
  }, [open]);

  const showToast = (msg, options = {}) => {
    const sev = options.severity || 'info';
    queueRef.current.push({ message: msg, severity: sev });
    processQueue();
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleExited = () => {
    // show next in queue
    processQueue();
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        onExited={handleExited}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (ctx === undefined) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export default ToastContext;
