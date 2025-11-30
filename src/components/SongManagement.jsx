import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, ListMusic, Music, Search } from 'lucide-react';
import SongFormModal from './SongFormModal'; // Modal único para Añadir/Editar

/**
 * Componente para gestionar la biblioteca de canciones.
 * Utiliza onSaveSong para ADD/EDIT y onDeleteSong para DELETE, 
 * unificando la comunicación con el componente padre (App.jsx).
 */
const SongManagement = ({
    songs,
    isAdmin,
    onSaveSong, // Función unificada para guardar (add/update)
    onDeleteSong, // Función para iniciar la confirmación de borrado
    setMessage, // Función para mostrar mensajes de feedback
}) => {
    // --- Estados para la lógica de Add/Edit ---
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [editingSong, setEditingSong] = useState(null); // null para añadir, objeto canción para editar
    const [searchText, setSearchText] = useState('');

    // --- Lógica del Buscador ---
    const filteredSongs = useMemo(() => {
        const lowerCaseSearch = searchText.toLowerCase();
        return songs.filter(song => 
            song.name.toLowerCase().includes(lowerCaseSearch) ||
            (song.artist && song.artist.toLowerCase().includes(lowerCaseSearch)) ||
            (song.key && song.key.toLowerCase().includes(lowerCaseSearch))
        );
    }, [songs, searchText]);

    // --- Handlers de Formulario ---
    const handleOpenCreate = () => {
        if (!isAdmin) {
            return setMessage("No tienes permisos de administración.", 'warning');
        }
        setEditingSong({ 
            name: '', 
            artist: '', 
            key: '', 
            sheetMusicLink: '', 
            videoLink: '' 
        });
        setFormModalOpen(true);
    };

    const handleOpenEdit = (song) => {
        if (!isAdmin) {
            return setMessage("No tienes permisos de administración.", 'warning');
        }
        setEditingSong(song);
        setFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
        setEditingSong(null);
    };

    // La función handleSave se ejecutará dentro de SongFormModal, que llamará a onSaveSong
    // con los datos y el ID (si existe).

    return (
        <section className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <ListMusic size={28} className="mr-3 text-indigo-600" />
                Biblioteca de Canciones
            </h2>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                {/* Buscador */}
                <div className="flex-grow relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, artista o tonalidad..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    />
                </div>
                
                {/* Botón Añadir */}
                {isAdmin && (
                    <button 
                        onClick={handleOpenCreate} 
                        className="flex-shrink-0 flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] font-medium"
                    >
                        <Plus size={20} className="mr-2" />
                        Añadir Canción
                    </button>
                )}
            </div>

            {/* Listado de Canciones */}
            <div className="max-h-[70vh] overflow-y-auto border border-gray-200 rounded-xl shadow-inner">
                {filteredSongs.length === 0 ? (
                    <p className="p-8 text-gray-500 text-center text-lg">
                        {songs.length === 0 ? "No hay canciones añadidas aún." : "No se encontraron resultados para la búsqueda."}
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {filteredSongs.map(song => (
                            <li key={song.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-indigo-50 transition duration-150 ease-in-out">
                                
                                {/* Detalles de la Canción */}
                                <div className="flex-grow min-w-0 mb-3 sm:mb-0">
                                    <h3 className="text-xl font-bold text-gray-900 truncate">{song.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">{song.artist || 'Artista Desconocido'}</span> 
                                        {song.key && <span className="ml-3 px-2 py-0.5 bg-indigo-100 text-indigo-700 font-medium text-xs rounded-full">Tonalidad: {song.key}</span>}
                                    </p>
                                </div>
                                
                                {/* Enlaces Rápidos y Acciones */}
                                <div className="flex items-center space-x-3 text-sm">
                                    {song.sheetMusicLink && (
                                        <a href={song.sheetMusicLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition duration-150 font-medium">Partitura</a>
                                    )}
                                    {song.videoLink && (
                                        <a href={song.videoLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition duration-150 font-medium">Video</a>
                                    )}

                                    {/* Botones Admin */}
                                    {isAdmin && (
                                        <div className="flex space-x-2 ml-4">
                                            <button 
                                                onClick={() => handleOpenEdit(song)} 
                                                className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition shadow-sm" 
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                // Llama a la prop onDeleteSong de App.jsx para iniciar la confirmación
                                                onClick={() => onDeleteSong(song.id, song.name)} 
                                                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm" 
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Modal de Formulario de Canción (Añadir/Editar) */}
            <SongFormModal 
                show={isFormModalOpen} 
                onClose={handleCloseFormModal} 
                initialSong={editingSong} 
                onSave={onSaveSong} 
                setMessage={setMessage}
            />
        </section>
    );
};

export default SongManagement;
