import React from 'react';

const Modal = ({ show, onClose, title, children, widthClass = 'max-w-md' }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-lg shadow-xl p-6 ${widthClass} w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100`}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;