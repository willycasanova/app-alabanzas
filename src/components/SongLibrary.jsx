import React from 'react';
import { Plus, Music } from 'lucide-react'; // CORREGIDO: Añadimos Music aquí

const SongLibrary = ({ 
    songs, addSong, updateSong, deleteSong, openSongDetails, startLivePerformance, 
    isAdmin, setMessage, setMessageType
}) => {
    // Componente temporal: La lógica de la librería de canciones se implementará más adelante.

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Librería de Canciones ({songs.length})</h2>
                {isAdmin && (
                    <button
                        onClick={() => {
                            // Lógica para abrir modal de nueva canción
                            setMessage("Funcionalidad 'Agregar Canción' pendiente de implementar.", 'info');
                            setMessageType('info');
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 font-medium"
                    >
                        <Plus size={20} />
                        <span>Añadir Canción</span>
                    </button>
                )}
            </div>
            
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                <Music size={48} className="mx-auto text-indigo-400 mb-4" />
                <p className="text-gray-600">
                    Aquí se mostrará la lista completa de canciones. Por favor, selecciona la pestaña 
                    <span className="font-semibold text-indigo-600"> "Calendario y Notas"</span> para ver el calendario implementado.
                </p>
            </div>
        </div>
    );
};

export default SongLibrary;
