// src/components/SongPresentationModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal'; // Asegúrate de que esta ruta sea correcta para tu Modal base

const SongPresentationModal = ({ show, onClose, songsToPresent, initialSongIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialSongIndex);

    // Resetea el índice cuando el modal se abre o las canciones cambian
    useEffect(() => {
        if (show) {
            setCurrentIndex(initialSongIndex);
        }
    }, [show, initialSongIndex, songsToPresent]);

    const currentSong = songsToPresent[currentIndex];

    const goToNextSong = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % songsToPresent.length);
    }, [songsToPresent.length]);

    const goToPreviousSong = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + songsToPresent.length) % songsToPresent.length);
    }, [songsToPresent.length]);

    // Manejar las teclas de flecha para la navegación
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!show) return; // Solo activa las teclas si el modal está visible

            if (event.key === 'ArrowRight') {
                goToNextSong();
            } else if (event.key === 'ArrowLeft') {
                goToPreviousSong();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [show, goToNextSong, goToPreviousSong]);

    if (!currentSong && show) { // Asegúrate de que el modal se muestre aunque no haya canciones, para el mensaje
        return (
            <Modal show={show} onClose={onClose} title="Presentación de Canciones">
                <p className="text-center text-gray-600">No hay canciones para presentar en esta fecha.</p>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </Modal>
        );
    }

    if (!show || !currentSong) { // No renderizar si no está visible o no hay canción actual
        return null;
    }

    // Función para obtener el ID de YouTube de un enlace
    const getYouTubeVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const youtubeId = currentSong.videoLink ? getYouTubeVideoId(currentSong.videoLink) : null;

    return (
        <Modal show={show} onClose={onClose} title={`Presentando: ${currentSong.name}`}>
            <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">{currentSong.name}</h3>
                <p className="text-lg text-gray-700 mb-4">Tonalidad: {currentSong.key}</p>

                {/* Controles de Navegación */}
                <div className="flex justify-between w-full mb-4 px-4">
                    <button
                        onClick={goToPreviousSong}
                        disabled={songsToPresent.length <= 1}
                        className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-xl"
                    >
                        ← Anterior
                    </button>
                    <span className="text-xl font-semibold text-gray-800 self-center">
                        {currentIndex + 1} / {songsToPresent.length}
                    </span>
                    <button
                        onClick={goToNextSong}
                        disabled={songsToPresent.length <= 1}
                        className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-xl"
                    >
                        Siguiente →
                    </button>
                </div>

                {/* Contenido de la Canción (Partitura / Video) */}
                <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
                    {currentSong.sheetMusicLink && (
                        <div className="flex-1 min-h-[300px] md:min-h-[400px] bg-gray-100 rounded-lg overflow-hidden shadow-inner flex flex-col items-center justify-center p-2">
                            <h4 className="text-lg font-semibold mb-2">Partitura</h4>
                            {/* Intentar incrustar con iframe, si no, botón para abrir */}
                            {currentSong.sheetMusicLink.includes('drive.google.com') || currentSong.sheetMusicLink.includes('docs.google.com') ? (
                                <iframe
                                    src={`${currentSong.sheetMusicLink.replace('/view', '/preview')}?usp=sharing&embed=true`}
                                    className="w-full h-full border-0 rounded-md"
                                    title={`Partitura de ${currentSong.name}`}
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <a
                                    href={currentSong.sheetMusicLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Abrir Partitura
                                </a>
                            )}
                        </div>
                    )}
                    {currentSong.videoLink && (
                        <div className="flex-1 min-h-[300px] md:min-h-[400px] bg-gray-100 rounded-lg overflow-hidden shadow-inner flex flex-col items-center justify-center p-2">
                            <h4 className="text-lg font-semibold mb-2">Video</h4>
                            {/* Youtube embedding */}
                            {youtubeId ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    className="w-full h-full border-0 rounded-md"
                                    title={`Video de ${currentSong.name}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <a
                                    href={currentSong.videoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Abrir Video
                                </a>
                            )}
                        </div>
                    )}
                    {!currentSong.sheetMusicLink && !currentSong.videoLink && (
                        <p className="text-center text-gray-500 w-full">No hay enlaces de partitura o video para esta canción.</p>
                    )}
                </div>

                {/* Botón de Cierre */}
                <button
                    onClick={onClose}
                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition w-full md:w-auto"
                >
                    Cerrar Presentación
                </button>
            </div>
        </Modal>
    );
};

export default SongPresentationModal;