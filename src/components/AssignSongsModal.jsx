// AssignSongsModal.jsx

import React from 'react';
import Modal from './Modal'; // Asegúrate de que la ruta sea correcta

const AssignSongsModal = ({ 
    show, 
    onClose, 
    songs = [], // <<<<<<< ¡¡¡ESTE ES EL CAMBIO CLAVE!!!
    sundayDateToAssign, 
    selectedSongsForSunday, 
    handleSongSelectionForSunday, 
    assignSongsToSunday 
}) => {
    // ... (el resto de tu código del componente AssignSongsModal)

    // Por ejemplo, la línea 25 que daba error, ahora sería segura
    // ya que 'songs' sería al menos un array vacío
    return (
        <Modal show={show} onClose={onClose} title={`Asignar Canciones para ${sundayDateToAssign ? sundayDateToAssign.toLocaleDateString('es-ES') : ''}`} widthClass="max-w-xl">
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Selecciona hasta 6 Canciones</h3>
                <div className="max-h-60 overflow-y-auto border rounded-md p-3 mb-4">
                    {songs.length > 0 ? ( // Esta línea ahora será segura
                        <ul className="space-y-2">
                            {songs.map(song => (
                                <li key={song.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`assign-song-${song.id}`}
                                        checked={selectedSongsForSunday.includes(song.id)}
                                        onChange={() => handleSongSelectionForSunday(song.id)}
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                    />
                                    <label htmlFor={`assign-song-${song.id}`} className="ml-2 text-gray-700">
                                        {song.name} ({song.key})
                                    </label>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No hay canciones disponibles para asignar. Añade algunas desde la sección "Gestión de Canciones".</p>
                    )}
                </div>

                {/* ... resto del modal */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={assignSongsToSunday}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                        Asignar Canciones
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AssignSongsModal;