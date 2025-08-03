import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    // Restaurar scroll cuando el modal se cierra o el componente se desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen ) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 relative w-full max-w-2xl">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer mr-3 mt-1"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}