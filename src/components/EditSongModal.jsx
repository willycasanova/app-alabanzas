// src/components/EditSongModal.jsx
import React from 'react';
import Modal from './Modal';

const EditSongModal = ({
    show,
    onClose,
    editingSongName,
    setEditingSongName,
    editingSongKey,
    setEditingSongKey,
    editingSongSheetMusicLink,
    setEditingSongSheetMusicLink,
    editingSongVideoLink,
    setEditingSongVideoLink,
    updateSong,
}) => {
    return (
        <Modal show={show} onClose={onClose} title="Editar Canción">
            <div className="p-4">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="editingSongName">Nombre de la Canción:</label>
                    <input
                        id="editingSongName"
                        type="text"
                        value={editingSongName}
                        onChange={(e) => setEditingSongName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Ej: Poderoso Dios"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="editingSongKey">Tonalidad:</label>
                    <input
                        id="editingSongKey"
                        type="text"
                        value={editingSongKey}
                        onChange={(e) => setEditingSongKey(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Ej: G mayor"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="editingSongSheetMusicLink">Enlace a partitura/letra:</label>
                    <input
                        id="editingSongSheetMusicLink"
                        type="text"
                        value={editingSongSheetMusicLink}
                        onChange={(e) => setEditingSongSheetMusicLink(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Ej: https://... (opcional)"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="editingSongVideoLink">Enlace a video (YouTube, etc.):</label>
                    <input
                        id="editingSongVideoLink"
                        type="text"
                        value={editingSongVideoLink}
                        onChange={(e) => setEditingSongVideoLink(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Ej: https://www.youtube.com/watch?v=..."
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                    >
                        Cancelar
                    </button>
                    {/* --- CAMBIO AQUÍ: Se añadió el evento onClick para llamar a la función updateSong --- */}
                    <button
                        onClick={updateSong}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    >
                        Actualizar Canción
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditSongModal;