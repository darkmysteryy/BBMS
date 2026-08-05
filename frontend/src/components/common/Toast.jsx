// components/common/Toast.jsx
// Shows toast notifications in bottom-right corner

const Toast = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{icons[toast.type] || "ℹ️"}</span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
