import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Asegúrate de que Modal.jsx exista
import { Save, Music, Key, User, Link, Youtube } from 'lucide-react';

/**
 * Modal unificado para crear o editar una canción.
 *
 * @param {boolean} show - Si el modal está visible.
 * @param {object} initialSong - El objeto canción para editar, o un objeto vacío para crear.
 * @param {function} onSave - Función de guardado (create/update) de App.jsx.
 * @param {function} onClose - Función para cerrar el modal.
 * @param {function} setMessage - Función para mostrar notificaciones.
 */
const SongFormModal = ({ show, onClose, initialSong, onSave, setMessage }) => {
    const [songData, setSongData] = useState({
        name: '',
        artist: '',
        key: '',
        sheetMusicLink: '',
        videoLink: '',
    });

    const isEditMode = !!initialSong?.id;

    // Sincronizar el estado interno con la canción inicial al abrir el modal
    useEffect(() => {
        if (initialSong) {
            setSongData({
                name: initialSong.name || '',
                artist: initialSong.artist || '',
                key: initialSong.key || '',
                sheetMusicLink: initialSong.sheetMusicLink || '',
                videoLink: initialSong.videoLink || '',
            });
        }
    }, [initialSong]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSongData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!songData.name.trim() || !songData.key.trim()) {
            setMessage("El nombre y la tonalidad son obligatorios.", 'error');
            return;
        }

        // Llamar a la función de guardado con los datos y el ID (si estamos editando)
        await onSave(songData, initialSong?.id);
        onClose();
    };

    if (!show) return null;

    return (
        <Modal 
            show={show} 
            onClose={onClose} 
            title={isEditMode ? "Editar Canción" : "Añadir Nueva Canción"}
        >
            <div className="p-6">
                
                {/* Nombre de la Canción */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Music size={16} className="mr-2 text-indigo-500"/> Nombre <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={songData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                
                {/* Artista */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <User size={16} className="mr-2 text-indigo-500"/> Artista
                    </label>
                    <input
                        type="text"
                        name="artist"
                        value={songData.artist}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                {/* Tonalidad */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Key size={16} className="mr-2 text-indigo-500"/> Tonalidad (Key) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        name="key"
                        value={songData.key}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                {/* Enlace a Partitura */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Link size={16} className="mr-2 text-indigo-500"/> Enlace a Partitura (PDF/Drive)
                    </label>
                    <input
                        type="url"
                        name="sheetMusicLink"
                        value={songData.sheetMusicLink}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Enlace a Video */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Youtube size={16} className="mr-2 text-indigo-500"/> Enlace a Video (YouTube/Vimeo)
                    </label>
                    <input
                        type="url"
                        name="videoLink"
                        value={songData.videoLink}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Botón de Guardar */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 font-medium"
                    >
                        <Save size={20} className="mr-2" />
                        {isEditMode ? "Actualizar Canción" : "Guardar Canción"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SongFormModal;
