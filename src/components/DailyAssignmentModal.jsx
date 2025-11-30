import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { formatDate } from '../utils/dateUtils';

const DailyAssignmentModal = ({
    show,
    onClose,
    selectedDate,
    songs,
    assignedSongs,
    dailyNotes,
    saveDailyNote,
    saveSundayAssignments,
    openSongDetails,
}) => {
    const [note, setNote] = useState('');
    const [currentAssigned, setCurrentAssigned] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (selectedDate) {
            const dateString = formatDate(selectedDate);
            setNote(dailyNotes[dateString] || '');
            if (selectedDate.getDay() === 0) {
                setCurrentAssigned(assignedSongs[dateString] || []);
            } else {
                setCurrentAssigned([]);
            }
        }
    }, [selectedDate, dailyNotes, assignedSongs]);

    if (!selectedDate) return null;

    const isSunday = selectedDate.getDay() === 0;

    const handleSave = () => {
        saveDailyNote(selectedDate, note);
        if (isSunday) {
            saveSundayAssignments(selectedDate, currentAssigned);
        }
        onClose();
    };

    const handleAddSong = (songId) => {
        if (!currentAssigned.includes(songId)) {
            setCurrentAssigned([...currentAssigned, songId]);
        }
    };

    const handleRemoveSong = (songId) => {
        setCurrentAssigned(currentAssigned.filter(id => id !== songId));
    };

    const assignedSongsDetails = currentAssigned.map(id => songs.find(s => s.id === id)).filter(Boolean);
    const availableSongs = songs.filter(s => !currentAssigned.includes(s.id) && s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Modal show={show} onClose={onClose} title={`Detalles para ${formatDate(selectedDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}>
            <div className="space-y-6 p-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Notas del Día</h3>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        rows="3"
                        placeholder="Añade tus notas aquí..."
                    />
                </div>

                {isSunday && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Canciones Asignadas</h3>
                        <div className="max-h-40 overflow-y-auto border rounded p-2 mb-4">
                            {assignedSongsDetails.length > 0 ? (
                                <ul>
                                    {assignedSongsDetails.map(song => (
                                        <li key={song.id} className="flex justify-between items-center p-1">
                                            <span className="cursor-pointer hover:underline" onClick={() => openSongDetails(song)}>{song.name}</span>
                                            <button onClick={() => handleRemoveSong(song.id)} className="text-red-500 hover:text-red-700">Quitar</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 italic text-center">No hay canciones asignadas.</p>}
                        </div>

                        <h3 className="text-lg font-semibold mb-2">Añadir Canción</h3>
                        <input
                            type="text"
                            placeholder="Buscar canción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-2"
                        />
                        <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {availableSongs.map(song => (
                                <div key={song.id} className="flex justify-between items-center p-1">
                                    <span>{song.name}</span>
                                    <button onClick={() => handleAddSong(song.id)} className="text-green-500 hover:text-green-700">Añadir</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Guardar Cambios</button>
                </div>
            </div>
        </Modal>
    );
};

export default DailyAssignmentModal;