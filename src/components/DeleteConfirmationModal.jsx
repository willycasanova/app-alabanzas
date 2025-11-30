import React from 'react';
import Modal from './Modal'; // Asegúrate de que Modal.jsx exista
import { AlertTriangle, Trash2 } from 'lucide-react';

/**
 * Modal para confirmar la eliminación de cualquier elemento (canción, servicio, etc.).
 *
 * @param {boolean} show - Si el modal está visible.
 * @param {function} onClose - Función para cerrar el modal.
 * @param {function} onConfirm - Función que se llama al confirmar la eliminación.
 * @param {string} itemType - Tipo de elemento a eliminar (e.g., "Canción", "Servicio").
 * @param {string} itemName - Nombre del elemento a eliminar.
 */
const DeleteConfirmationModal = ({ show, onClose, onConfirm, itemType, itemName }) => {
    if (!show) return null;

    return (
        <Modal show={show} onClose={onClose} title={`Confirmar Eliminación de ${itemType}`}>
            <div className="p-6 text-center">
                <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    ¿Estás seguro de que quieres eliminar est{itemType.endsWith('ón') ? 'a' : 'e'} {itemType}?
                </h3>
                {itemName && (
                    <p className="text-xl font-bold text-gray-900 mb-4">"{itemName}"</p>
                )}
                <p className="text-gray-600 mb-6">
                    Esta acción es permanente y no se puede deshacer.
                </p>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition duration-150 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-red-700 transition duration-300 font-medium"
                    >
                        <Trash2 size={20} className="mr-2" />
                        Sí, Eliminar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;
