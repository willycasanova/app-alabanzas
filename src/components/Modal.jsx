import React from 'react';

const Modal = ({ show, onClose, title, customZIndex, children }) => {
    if (!show) {
        return null;
    }
    return (
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center ${customZIndex}`}>
            <div className="relative p-6 bg-white w-96 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="mt-2 text-gray-600">
                    {children}
                </div>
                <button
                    onClick={onClose}
                    aria-label="Cerrar modal"
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-150"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Modal;

