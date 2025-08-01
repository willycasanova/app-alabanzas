import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Asegúrate de que la ruta a Modal.jsx sea correcta
import { formatDate } from '../utils/dateUtils'; // <-- IMPORTACIÓN DE LA FUNCIÓN DE UTILIDAD

const NotesAndAssignmentsUnifiedModal = ({
    show,
    onClose,
    selectedDate,
    saveDailyNote, // Esta prop ahora aceptará el valor de la nota como argumento
    isSunday,
    sundayAssignedSongIds,
    setSundayAssignedSongIds,
    assignSongsToSunday,
    sundayAssignedSongsDisplay,
    openSongDetails,
    setMessage,
    setMessageType,
    initialNoteValue, // Para inicializar el estado local de la nota
    songs // Reintroducida para la pestaña de asignación
}) => {
    const [activeTab, setActiveTab] = useState('notes');
    const [modalNote, setModalNote] = useState(''); // ESTADO LOCAL para la nota del textarea

    // Sincroniza el estado local del modal con la prop initialNoteValue
    // Se ejecuta cuando el modal se muestra o cuando initialNoteValue cambia (ej. al seleccionar otra fecha)
    useEffect(() => {
        if (show) {
            setActiveTab('notes'); // Por defecto a la pestaña de notas al abrir
            setModalNote(initialNoteValue || ''); // Inicializa el estado local con la nota de la prop
        }
    }, [show, initialNoteValue]); // Dependencias: show y initialNoteValue

    // formattedDateDisplay no se usa, pero si se necesitara, se usaría formatDate(selectedDate)
    // const formattedDateDisplay = selectedDate ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const isSelectedDateSunday = selectedDate && selectedDate.getDay() === 0;

    // Handler para guardar la nota, llama a la prop saveDailyNote con el estado local
    const handleSaveNote = () => {
        saveDailyNote(modalNote); // Pasa el valor del estado local modalNote al padre
    };

    const handleSongSelection = (songId) => {
        setSundayAssignedSongIds(prevSelected => {
            const currentSelected = Array.isArray(prevSelected) ? prevSelected : [];

            if (currentSelected.includes(songId)) {
                return currentSelected.filter(id => id !== songId);
            } else {
                if (currentSelected.length < 6) { // Limit to 6 songs
                    return [...currentSelected, songId];
                } else {
                    setMessage("Solo puedes asignar un máximo de 6 canciones por domingo.", 'error');
                    setMessageType('error');
                    return currentSelected;
                }
            }
        });
    };

    const safeSongs = Array.isArray(songs) ? songs : [];
    const safeSundayAssignedSongIds = Array.isArray(sundayAssignedSongIds) ? sundayAssignedSongIds : [];

    const sundayAssignedSongsDisplayFiltered = safeSongs.filter(s =>
        safeSundayAssignedSongIds.includes(s.id)
    );

    return (
        <Modal show={show} onClose={onClose} title={`Detalles para ${selectedDate ? formatDate(selectedDate) : ''}`}>
            <div className="p-4">
                {isSelectedDateSunday && (
                    <div className="flex justify-center mb-4 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`py-2 px-4 text-lg font-medium ${activeTab === 'notes' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Notas
                        </button>
                        <button
                            onClick={() => setActiveTab('assign')}
                            className={`py-2 px-4 text-lg font-medium ${activeTab === 'assign' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Asignar Canciones
                        </button>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="space-y-4">
                        <textarea
                            value={modalNote} // Usa el estado local aquí
                            onChange={(e) => setModalNote(e.target.value)} // Actualiza el estado local
                            placeholder="Añade tus notas aquí..."
                            className="w-full p-2 border rounded h-32"
                        ></textarea>
                        <button onClick={handleSaveNote} className="w-full bg-indigo-500 text-white p-2 rounded">Guardar Nota</button>

                        {modalNote && (
                            <div className="mt-4 border-t pt-4">
                                <h4 className="text-lg font-semibold mb-2">Nota Guardada:</h4>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {modalNote}
                                </p>
                            </div>
                        )}

                        {isSelectedDateSunday && Array.isArray(sundayAssignedSongsDisplayFiltered) && sundayAssignedSongsDisplayFiltered.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <h4 className="text-lg font-semibold mb-2">Canciones Asignadas:</h4>
                                <ul className="list-disc pl-5">
                                    {sundayAssignedSongsDisplayFiltered.map(song => (
                                        <li key={song.id} className="text-gray-700 flex justify-between items-center">
                                            <span>{song.name} ({song.key})</span>
                                            <button onClick={() => openSongDetails(song)} className="ml-2 text-blue-500 hover:underline text-sm">Ver</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'assign' && isSelectedDateSunday && ( // Asegúrate de que solo se muestre si es domingo
                    <div className="space-y-4">
                        <p className="text-gray-700 mb-2">Selecciona hasta 6 canciones para este domingo:</p>
                        <ul className="max-h-60 overflow-y-auto border rounded p-2">
                            {Array.isArray(safeSongs) && safeSongs.length > 0 ? (
                                safeSongs.map(song => (
                                    <li key={song.id} className="flex items-center justify-between py-1">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={safeSundayAssignedSongIds.includes(song.id)}
                                                onChange={() => handleSongSelection(song.id)}
                                                className="form-checkbox"
                                            />
                                            <span>{song.name} ({song.key})</span>
                                        </label>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No hay canciones disponibles para seleccionar.</p>
                            )}
                        </ul>
                        <button onClick={assignSongsToSunday} className="w-full bg-indigo-500 text-white p-2 rounded mt-4">Confirmar Asignación</button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default NotesAndAssignmentsUnifiedModal;
