import React from 'react';
import Modal from './Modal';

const ConfirmDeleteModal = ({ show, onClose, onConfirm, itemType = "elemento" }) => {
    return (
        <Modal show={show} onClose={onClose} title={`Confirmar Eliminación de ${itemType}`}>
            <div className="text-center p-4">
                <p className="text-lg text-gray-700 mb-6">
                    ¿Estás seguro de que quieres eliminar este {itemType}? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;