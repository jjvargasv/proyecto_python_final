import { useState } from "react";

export default function useToast() {
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  function showToast(message, type = "info", duration = 2000) {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "info" }), duration);
  }

  function ToastComponent() {
    if (!toast.visible) return null;
    let color = toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-purple-700";
    return (
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white font-bold text-lg animate-fade-in-up ${color}`}
           style={{ minWidth: 200, textAlign: 'center' }}>
        {toast.message}
      </div>
    );
  }

  return { showToast, ToastComponent };
}
