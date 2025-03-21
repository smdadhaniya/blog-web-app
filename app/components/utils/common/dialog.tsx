import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  width?: string;
  children: React.ReactNode;
}

const Dialog: React.FC<ModalProps> = ({
  open,
  onClose,
  width = "w-1/2",
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 bg-transparent backdrop-blur-xs"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-8 ${width} transition-all duration-300`}
        role="dialog"
      >
        <div className="flex justify-end mb-4">
          <button
            className="text-red-500 font-bold text-xl"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>
        <div id="modal-description">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
