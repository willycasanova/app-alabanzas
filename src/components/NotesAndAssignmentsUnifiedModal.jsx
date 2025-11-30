// src/components/NotesAndAssignmentsUnifiedModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { formatDate } from '../utils/dateUtils';
import SongList from './SongList';

const NotesAndAssignmentsUnifiedModal = ({ 
    show, 
    onClose, 
    selectedDate, 
    initialNoteValue, 
    saveDailyNote, 
    isSunday, 
    songs, 
    sundayAssignedSongIds, 
    setSundayAssignedSongIds,
    assignSongsToSunday,
    openSongDetails,
    setMessage,
    setMessageType,
    startLivePerformance,
}) => {
    const [note, setNote] = useState(initialNoteValue);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (show) {
            setNote(initialNoteValue);
            setSearchTerm('');
        }
    }, [initialNoteValue, show]);

    const showNotification = (message, type) => {
        setMessage(message);
        setMessageType(type);
    };

    const handleSaveNote = async () => {
        // ✅ Se eliminó la validación que impedía guardar notas vacías.
        await saveDailyNote(selectedDate, note);
        showNotification("Nota guardada con éxito.", 'success');
    };

    const handleAddSong = (songId) => {
        if (!sundayAssignedSongIds.includes(songId)) {
            setSundayAssignedSongIds([...sundayAssignedSongIds, songId]);
        }
    };
    
    const handleRemoveAssignedSong = (songId) => {
        const updatedSongs = sundayAssignedSongIds.filter(id => id !== songId);
        setSundayAssignedSongIds(updatedSongs);
    };

    const handleSaveAssignments = async () => {
        if (!selectedDate) {
            showNotification("Error: Fecha no seleccionada.", 'error');
            return;
        }
        await assignSongsToSunday();
        onClose();
        showNotification("Asignaciones guardadas con éxito.", 'success');
    };

    const assignedSongsDetails = sundayAssignedSongIds
        .map(id => songs.find(s => s.id === id))
        .filter(Boolean);

    const availableSongs = songs
        .filter(song => !sundayAssignedSongIds.includes(song.id))
        .filter(song => song.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
    const handleStartLivePerformance = () => {
        if (assignedSongsDetails.length === 0) {
            showNotification('No hay canciones asignadas para iniciar el modo en vivo.', 'warning');
            return;
        }

        if (typeof startLivePerformance === 'function') {
            const setlist = {
                name: `Setlist - ${selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}`,
                songs: assignedSongsDetails
            };
            startLivePerformance(setlist);
            onClose();
        } else {
            console.error("La prop 'startLivePerformance' no es una función.");
            showNotification('Error al iniciar el modo en vivo.', 'error');
        }
    };

    const AssignedSongItem = ({ song, onRemove, onDetails }) => (
        <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
            <div className="flex-grow">{song.name}</div>
            <div className="flex space-x-2">
                <button onClick={() => onDetails(song)} className="text-gray-500 hover:text-gray-700" title="Ver detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <button onClick={() => onRemove(song.id)} className="text-red-500 hover:text-red-700" title="Quitar canción">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </li>
    );
    return (
        <Modal show={show} onClose={onClose} customZIndex="z-[41]">
            <div className="p-6">
                <h2 className="text-3xl font-bold mb-4 text-center">
                    {selectedDate ? formatDate(selectedDate) : 'Notas y Asignaciones'}
                </h2>
                {/* Notas */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Notas del Día</h3>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full p-2 border rounded-lg text-gray-900"
                        placeholder="Escribe tus notas aquí..."
                        rows="4"
                    ></textarea>
                    <button 
                        onClick={handleSaveNote}
                        className="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Guardar Nota
                    </button>
                </div>
                {/* Asignaciones para domingo */}
                {isSunday && (
                    <>
                        <hr className="my-6" />
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Canciones Asignadas</h3>
                            {assignedSongsDetails.length > 0 && (
                                <button
                                    onClick={handleStartLivePerformance}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Tocar Setlist en Vivo
                                </button>
                            )}
                        </div>

                        <div className="max-h-48 overflow-y-auto mb-4 border rounded-lg p-2 bg-gray-50">
                            {assignedSongsDetails.length === 0 ? (
                                <p className="text-center text-gray-500 italic">No hay canciones asignadas.</p>
                            ) : (
                                <ul>
                                    {assignedSongsDetails.map(song => <AssignedSongItem key={song.id} song={song} onRemove={handleRemoveAssignedSong} onDetails={openSongDetails} />)}
                                </ul>
                            )}
                        </div>

                        <h3 className="text-xl font-semibold mb-2">Añadir Canciones</h3>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4 text-gray-900"
                            placeholder="Buscar y añadir canciones..."
                        />
                        <div className="max-h-48 overflow-y-auto mb-6 border rounded-lg p-2 bg-gray-50">
                            <SongList
                                songs={availableSongs}
                                onAction={handleAddSong}
                                onNameClick={openSongDetails}
                                actionIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                                actionTitle="Añadir canción"
                                emptyListMessage="No hay canciones para añadir."
                            />
                        </div>
                        <button 
                            onClick={handleSaveAssignments}
                            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition font-bold"
                        >
                            Guardar Asignaciones
                        </button>
                    </>
                )}
                <div className="mt-4 text-right">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default NotesAndAssignmentsUnifiedModal;