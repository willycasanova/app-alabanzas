// src/components/NotesAndAssignmentsModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import SongDetailsModal from './SongDetailsModal'; // Asegúrate de que esta importación sea correcta

const NotesAndAssignmentsUnifiedModal = ({ show, onClose, date, initialNote, songs, onSave, assignedSongsForDate, setAssignedSongsForDate }) => {
    const [note, setNote] = useState(initialNote || '');
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [showSongDetails, setShowSongDetails] = useState(false);
    const [selectedSongForDetails, setSelectedSongForDetails] = useState(null);

    const isSunday = date && date.getDay() === 0; // 0 for Sunday

    useEffect(() => {
        setNote(initialNote || '');
    }, [initialNote]);

    useEffect(() => {
        // Al abrir el modal o cambiar la fecha, establecer las canciones asignadas inicialmente
        if (assignedSongsForDate && assignedSongsForDate.length > 0) {
            setSelectedSongs(assignedSongsForDate.map(song => song.id));
        } else {
            setSelectedSongs([]);
        }
    }, [assignedSongsForDate, date]);

    const handleSave = () => {
        const assignedSongObjects = selectedSongs.map(songId => songs.find(s => s.id === songId)).filter(Boolean);
        onSave(date, note, assignedSongObjects);
        onClose(); // Cierra el modal después de guardar
    };

    const handleSongSelectionChange = useCallback((songId, isChecked) => {
        setSelectedSongs(prevSelectedSongs => {
            if (isChecked) {
                return [...prevSelectedSongs, songId];
            } else {
                return prevSelectedSongs.filter(id => id !== songId);
            }
        });
    }, []);

    const handleAssignSongs = () => {
        const assignedSongObjects = selectedSongs.map(songId => songs.find(s => s.id === songId)).filter(Boolean);
        setAssignedSongsForDate(date, assignedSongObjects);
        onClose(); // Cierra el modal después de guardar las asignaciones
    };

    const openSongDetails = (song) => {
        setSelectedSongForDetails(song);
        setShowSongDetails(true);
    };

    const closeSongDetails = () => {
        setShowSongDetails(false);
        setSelectedSongForDetails(null);
    };

    if (!show || !date) {
        return null;
    }

    const formattedDate = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Modal
                show={show && !showSongDetails} // Solo muestra este modal si el de detalles de canción no está abierto
                onClose={handleSave} // Al cerrar, guarda la nota
                title={`Notas y Asignaciones para ${formattedDate}`}
            >
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Notas</h3>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                        rows="5"
                        placeholder="Escribe tus notas aquí..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>

                {isSunday && (
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Asignar Canciones para el Domingo</h3>
                        <div className="max-h-60 sm:max-h-80 md:max-h-[50vh] overflow-y-auto border border-gray-200 rounded-md p-2 mb-4">
                            {songs.length === 0 ? (
                                <p className="text-gray-500 text-center">No hay canciones disponibles para asignar.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {songs.map(song => (
                                        <li key={song.id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`song-${song.id}`}
                                                    checked={selectedSongs.includes(song.id)}
                                                    onChange={(e) => handleSongSelectionChange(song.id, e.target.checked)}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <label htmlFor={`song-${song.id}`} className="ml-3 text-lg font-medium text-gray-700 cursor-pointer">
                                                    {song.name} {song.key && <span className="text-sm text-gray-500">({song.key})</span>}
                                                </label>
                                            </div>
                                            <button
                                                onClick={() => openSongDetails(song)}
                                                className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                                title="Ver Detalles"
                                            >
                                                👁️
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            onClick={handleAssignSongs}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200 w-full"
                        >
                            Guardar Asignaciones
                        </button>
                    </div>
                )}
                {!isSunday && (
                    <div className="mt-6">
                         <button
                            onClick={handleSave}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200 w-full"
                        >
                            Guardar Nota
                        </button>
                    </div>
                )}
            </Modal>

            {selectedSongForDetails && (
                <SongDetailsModal
                    show={showSongDetails}
                    onClose={closeSongDetails}
                    song={selectedSongForDetails}
                />
            )}
        </>
    );
};

export default NotesAndAssignmentsUnifiedModal;