import { useState, createContext, useContext } from 'react';
import Home from './pages/Home.jsx';

// Toast Context for notifications
export const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="min-h-screen bg-dark-900 text-gray-200">
        <Home />

        {/* Toast container */}
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const bgColor =
    toast.type === 'error'
      ? 'bg-red-500/20 border-red-500/30 text-red-300'
      : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300';

  return (
    <div
      className={`${bgColor} border px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm min-w-[280px] animate-bounce-in flex items-center justify-between gap-3`}
    >
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-200 transition-colors text-lg leading-none"
        aria-label="Close toast"
      >
        &times;
      </button>
    </div>
  );
}

export default App;
