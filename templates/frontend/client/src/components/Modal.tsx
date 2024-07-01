
import React from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                {children}
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

export default Modal;