// src/components/UserNameInputModal.jsx
import React from 'react';
import Modal from './Modal';

const UserNameInputModal = ({ show, onClose, inputUserName, setInputUserName, onSave }) => {
    const handleSave = () => {
        if (inputUserName.trim() !== '') {
            onSave(inputUserName);
            onClose();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <Modal show={show} onClose={onClose} title="Ingresa tu nombre" zIndex="z-50">
            <div className="p-4">
                {/* --- CAMBIO AQUÍ --- */}
                {/* Se eliminó todo el texto de bienvenida y la sección "Alaba al Señor" */}
                {/* Solo se deja el campo de entrada y el botón de guardar */}
                <p className="text-gray-700 mb-4 text-center">
                    Por favor, ingresa tu nombre para personalizar tu experiencia.
                </p>
                <input
                    type="text"
                    value={inputUserName}
                    onChange={(e) => setInputUserName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-center text-lg"
                    placeholder="Tu nombre aquí"
                />
                <button
                    onClick={handleSave}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 w-full text-lg"
                >
                    Guardar
                </button>
            </div>
        </Modal>
    );
};

export default UserNameInputModal;