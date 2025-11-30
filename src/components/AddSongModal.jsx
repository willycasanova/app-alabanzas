// src/components/AddSongModal.jsx

import React from 'react';
import Modal from './Modal';

const AddSongModal = ({
    show,
    onClose,
    newSongName,
    setNewSongName,
    newSongKey,
    setNewSongKey,
    newSongSheetMusicLink,
    setNewSongSheetMusicLink,
    newSongVideoLink,
    setNewSongVideoLink,
    addSong // <-- CORREGIDO: ahora la prop se llama 'addSong' para coincidir con App.jsx
}) => {

    const handleAddSongClick = () => {
        addSong(); // Llama a la función del padre
        onClose(); // Cierra el modal después de la acción
    };

    return (
        <Modal show={show} onClose={onClose} title="Añadir Nueva Canción">
            <div className="space-y-4">
                <div>
                    <label htmlFor="newSongName" className="block text-sm font-medium text-gray-700">Nombre de la Canción:</label>
                    <input
                        type="text"
                        id="newSongName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={newSongName}
                        onChange={(e) => setNewSongName(e.target.value)}
                        placeholder="Ej: Grande Es Tu Fidelidad"
                    />
                </div>
                <div>
                    <label htmlFor="newSongKey" className="block text-sm font-medium text-gray-700">Tonalidad:</label>
                    <input
                        type="text"
                        id="newSongKey"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={newSongKey}
                        onChange={(e) => setNewSongKey(e.target.value)}
                        placeholder="Ej: C, G, Am"
                    />
                </div>
                <div>
                    <label htmlFor="newSongSheetMusicLink" className="block text-sm font-medium text-gray-700">Enlace a partitura/letra:</label>
                    <input
                        type="url"
                        id="newSongSheetMusicLink"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={newSongSheetMusicLink}
                        onChange={(e) => setNewSongSheetMusicLink(e.target.value)}
                        placeholder="https://ejemplo.com/partitura.pdf"
                    />
                </div>
                <div>
                    <label htmlFor="newSongVideoLink" className="block text-sm font-medium text-gray-700">Enlace a video (YouTube, etc.):</label>
                    <input
                        type="url"
                        id="newSongVideoLink"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={newSongVideoLink}
                        onChange={(e) => setNewSongVideoLink(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={handleAddSongClick}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                        Añadir Canción
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddSongModal;