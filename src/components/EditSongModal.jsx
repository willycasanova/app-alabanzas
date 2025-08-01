import React from 'react';
import Modal from './Modal';

const EditSongModal = ({ show, onClose, editingSongName, setEditingSongName, editingSongKey, setEditingSongKey, editingSongSheetMusicLink, setEditingSongSheetMusicLink, editingSongVideoLink, setEditingSongVideoLink, onUpdateSong }) => {
    return (
        <Modal show={show} onClose={onClose} title="Editar Canción">
            <div className="space-y-4">
                <div>
                    <label htmlFor="editSongName" className="block text-sm font-medium text-gray-700">Nombre de la Canción:</label>
                    <input
                        type="text"
                        id="editSongName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={editingSongName}
                        onChange={(e) => setEditingSongName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="editSongKey" className="block text-sm font-medium text-gray-700">Tonalidad:</label>
                    <input
                        type="text"
                        id="editSongKey"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={editingSongKey}
                        onChange={(e) => setEditingSongKey(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="editSongSheetMusicLink" className="block text-sm font-medium text-gray-700">Enlace a partitura/letra:</label>
                    <input
                        type="url"
                        id="editSongSheetMusicLink"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={editingSongSheetMusicLink}
                        onChange={(e) => setEditingSongSheetMusicLink(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="editSongVideoLink" className="block text-sm font-medium text-gray-700">Enlace a video (YouTube, etc.):</label>
                    <input
                        type="url"
                        id="editSongVideoLink"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={editingSongVideoLink}
                        onChange={(e) => setEditingSongVideoLink(e.target.value)}
                    />
                </div>
                <button
                    onClick={onUpdateSong}
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                    Actualizar Canción
                </button>
            </div>
        </Modal>
    );
};

export default EditSongModal;