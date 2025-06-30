import { ReactNode, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
  onConfirm?: (inputValue?: string) => void;
  showInput?: boolean;
  inputPlaceholder?: string;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  showInput,
  inputPlaceholder,
}: ModalProps) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50 pointer-events-none">
      <div
        className="bg-white rounded shadow p-4 max-w-md w-full pointer-events-auto"
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        {children}

        {showInput && (
          <input
            type="text"
            placeholder={inputPlaceholder}
            className="border rounded w-full p-2 my-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}

        <div className="flex justify-end mt-4 space-x-2">
          {onConfirm && (
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={() => {
                onConfirm(inputValue);
                onClose();
              }}
            >
              Confirmar
            </button>
          )}
        
        </div>
      </div>
    </div>
  );
}
