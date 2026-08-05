// hooks/useToast.js
// Simple toast notification state — used with the Toast component

import { useState, useCallback } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast message
  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

export default useToast;
