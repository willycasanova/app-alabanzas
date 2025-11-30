import React from 'react';

/**
 * Componente simple para renderizar una lista de canciones.
 *
 * @param {Array<Object>} songs - Lista de objetos de canciones.
 * @param {Function} onAction - Función a ejecutar al hacer clic en el botón de acción de la canción.
 * @param {Function} onNameClick - Función a ejecutar al hacer clic en el nombre de la canción.
 * @param {React.ReactNode} actionIcon - Icono del botón de acción.
 * @param {string} actionTitle - Título del botón de acción (tooltip).
 * @param {string} emptyListMessage - Mensaje a mostrar si la lista está vacía.
 */
const SongList = ({ 
    // Corregido: Inicializa 'songs' como un array vacío si es null/undefined para evitar el error '.length'
    songs = [], 
    onAction, 
    onNameClick, 
    actionIcon, 
    actionTitle, 
    emptyListMessage = "No hay elementos para mostrar." 
}) => {
    return (
        <ul className="divide-y divide-gray-200">
            {songs.length > 0 ? songs.map(song => (
                <li key={song.id} className="flex items-center justify-between p-3 hover:bg-gray-100 transition duration-150 rounded-lg">
                    <div className="flex-grow cursor-pointer" onClick={() => onNameClick(song)}>
                        <span className="font-medium text-gray-800">{song.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({song.key || 'Tono N/A'})</span>
                    </div>
                    {onAction && (
                        <button 
                            onClick={() => onAction(song.id)} 
                            className="text-indigo-600 hover:text-indigo-800 transition p-1 rounded-full hover:bg-white"
                            title={actionTitle}
                        >
                            {/* actionIcon es un elemento React válido */}
                            {actionIcon}
                        </button>
                    )}
                </li>
            )) : (
                <li className="p-4 text-center text-gray-500 italic">
                    {emptyListMessage}
                </li>
            )}
        </ul>
    );
};

export default SongList;
