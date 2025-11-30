// src/components/SongDetailsModal.jsx
import React from 'react';
import Modal from './Modal';

const SongDetailsModal = ({ show, onClose, song, customZIndex, startLivePerformance }) => {
    // Si no hay canción, no renderizamos el modal.
    if (!song) {
        return null;
    }

    // Función para crear un setlist con una sola canción y pasarla al modo en vivo
    const handleStartLivePerformance = () => {
        // Creamos un setlist que contiene solo la canción actual
        const singleSongSetlist = {
            name: song.name, // Usamos el nombre de la canción como nombre del setlist
            songs: [song],   // El array de canciones solo tiene la canción actual
        };
        startLivePerformance(singleSongSetlist);
        onClose(); // Cerramos el modal de detalles después de iniciar el modo en vivo
    };

    return (
        <Modal show={show} onClose={onClose} customZIndex={customZIndex}>
            <div className="p-4 sm:p-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-4 break-words">
                    {song.name}
                </h2>
                <div className="space-y-4 text-left">
                    <p className="text-xl sm:text-2xl text-gray-700">
                        <span className="font-semibold text-gray-900">Tonalidad:</span> {song.key || 'N/A'}
                    </p>
                    {song.sheetMusicLink && (
                        <p className="text-lg sm:text-xl text-gray-700 break-words">
                            <span className="font-semibold text-gray-900">Partitura/Letra:</span>{' '}
                            <a
                                href={song.sheetMusicLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-500 hover:text-indigo-600 underline"
                            >
                                Ver Partitura/Letra
                            </a>
                        </p>
                    )}
                    {song.videoLink && (
                        <p className="text-lg sm:text-xl text-gray-700 break-words">
                            <span className="font-semibold text-gray-900">Video de YouTube:</span>{' '}
                            <a
                                href={song.videoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-500 hover:text-indigo-600 underline"
                            >
                                Ver Video
                            </a>
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
                    <button
                        onClick={handleStartLivePerformance}
                        className="w-full sm:w-auto px-6 py-3 text-lg font-bold bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition-colors duration-200"
                    >
                        Tocar en Vivo
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 text-lg font-bold bg-gray-300 text-gray-800 rounded-lg shadow-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SongDetailsModal;