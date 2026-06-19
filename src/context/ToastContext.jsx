import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, tone = 'info') => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((items) => items.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ push, success: (m) => push(m, 'success'), error: (m) => push(m, 'error') }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-slide-up rounded-md px-4 py-3 text-sm font-medium shadow-soft ${
              toast.tone === 'error'
                ? 'bg-red-600 text-white'
                : toast.tone === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-adrde-navy text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
