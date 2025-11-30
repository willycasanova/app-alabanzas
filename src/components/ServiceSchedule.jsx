import React, { useState, useMemo } from 'react';
import { Plus, Calendar, Edit, Trash2, Clock, Music, Play, X } from 'lucide-react';
import Modal from './Modal';

// Formato de fecha para mostrar al usuario
const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch {
        return dateString; // En caso de error, devuelve la cadena original
    }
};

/**
 * Componente para gestionar y visualizar los servicios programados.
 * Recibe las funciones de CRUD y los datos desde App.jsx.
 */
const ServiceSchedule = ({
    services,
    allSongs,
    isAdmin,
    onSaveService,
    onDeleteService,
    getSongsForService,
    startLivePresentation,
    setMessage
}) => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [currentService, setCurrentService] = useState(null); // Servicio siendo editado/creado
    const [selectedSongIds, setSelectedSongIds] = useState([]);
    const [filterText, setFilterText] = useState('');

    // --- Memo para el listado de canciones filtradas en el modal ---
    const filteredSongs = useMemo(() => {
        if (!filterText) return allSongs;
        const lowerCaseFilter = filterText.toLowerCase();
        return allSongs.filter(song =>
            song.name.toLowerCase().includes(lowerCaseFilter) ||
            song.artist.toLowerCase().includes(lowerCaseFilter)
        );
    }, [allSongs, filterText]);


    // --- Handlers de Estado del Modal ---

    const handleOpenCreate = () => {
        if (!isAdmin) {
            return setMessage("No tienes permisos para crear servicios.", 'warning');
        }
        setCurrentService({ date: '', time: '', songIds: [] });
        setSelectedSongIds([]);
        setShowFormModal(true);
    };

    const handleOpenEdit = (service) => {
        if (!isAdmin) {
            return setMessage("No tienes permisos para editar servicios.", 'warning');
        }
        setCurrentService(service);
        setSelectedSongIds(service.songIds || []);
        setShowFormModal(true);
    };

    const handleCloseModal = () => {
        setShowFormModal(false);
        setCurrentService(null);
        setSelectedSongIds([]);
        setFilterText('');
    };


    // --- Lógica de Formulario y Guardado ---

    const handleSongToggle = (songId) => {
        setSelectedSongIds(prev => {
            if (prev.includes(songId)) {
                return prev.filter(id => id !== songId);
            } else {
                return [...prev, songId];
            }
        });
    };

    const handleSubmit = async () => {
        if (!currentService || !currentService.date) {
            return setMessage("La fecha del servicio es obligatoria.", 'error');
        }
        
        // Asegurar que songIds se guarda como un array
        const serviceData = {
            ...currentService,
            songIds: selectedSongIds,
        };

        await onSaveService(serviceData, currentService.id);
        handleCloseModal();
    };


    // --- Componente de Tarjeta de Servicio ---

    const ServiceCard = ({ service }) => {
        const serviceSongs = getSongsForService(service);
        const songCount = serviceSongs.length;
        const isPast = new Date(service.date) < new Date().setHours(0, 0, 0, 0);

        return (
            <div className={`bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-start transition duration-300 ${isPast ? 'opacity-60 border-l-4 border-gray-400' : 'hover:shadow-xl border-l-4 border-indigo-500'}`}>
                
                {/* Info del Servicio */}
                <div className="flex-grow mb-4 sm:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                        <Calendar size={24} className="text-indigo-600" />
                        <h3 className={`text-xl font-bold ${isPast ? 'text-gray-600' : 'text-indigo-700'}`}>
                            {formatDate(service.date)}
                            {isPast && <span className="ml-2 text-sm font-normal text-gray-500">(Pasado)</span>}
                        </h3>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-500 mb-3">
                        {service.time && (
                            <>
                                <Clock size={16} />
                                <span>{service.time}</span>
                            </>
                        )}
                    </div>
                    
                    <div className="text-sm text-gray-700">
                        <span className="font-semibold">{songCount}</span> {songCount === 1 ? 'canción asignada' : 'canciones asignadas'}
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-row">
                    {/* Botón de Presentación (Modo Vivo) */}
                    {serviceSongs.length > 0 && (
                        <button
                            onClick={() => startLivePresentation(service.songIds, service.songIds[0])}
                            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-150 font-semibold text-sm w-full sm:w-auto"
                        >
                            <Play size={18} className="mr-2" />
                            Modo Vivo
                        </button>
                    )}
                    
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => handleOpenEdit(service)}
                                className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition duration-150 w-full sm:w-auto"
                                aria-label="Editar servicio"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => onDeleteService(service.id, service.date)}
                                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-150 w-full sm:w-auto"
                                aria-label="Eliminar servicio"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    // --- Renderizado Principal ---

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Próximos Servicios</h2>
                {isAdmin && (
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 font-medium"
                    >
                        <Plus size={20} className="mr-2" />
                        Nuevo Servicio
                    </button>
                )}
            </div>

            {services.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl shadow-inner text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4" />
                    <p className="text-lg">No hay servicios programados. ¡Comienza creando uno!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {services.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            )}

            {/* Modal de Creación/Edición de Servicio */}
            <Modal show={showFormModal} onClose={handleCloseModal} title={currentService?.id ? "Editar Servicio" : "Crear Nuevo Servicio"}>
                {currentService && (
                    <div className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Servicio</label>
                            <input
                                type="date"
                                value={currentService.date || ''}
                                onChange={(e) => setCurrentService({...currentService, date: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora (Opcional)</label>
                            <input
                                type="time"
                                value={currentService.time || ''}
                                onChange={(e) => setCurrentService({...currentService, time: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <Music size={20} className="mr-2 text-indigo-500" />
                            Asignar Canciones ({selectedSongIds.length})
                        </h3>
                        
                        {/* Buscador de Canciones */}
                        <input
                            type="text"
                            placeholder="Buscar canción por nombre o artista..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        
                        {/* Lista de Canciones */}
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                            {filteredSongs.length > 0 ? (
                                filteredSongs.map(song => (
                                    <div 
                                        key={song.id} 
                                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition duration-150 ${
                                            selectedSongIds.includes(song.id) 
                                            ? 'bg-indigo-100 border border-indigo-400' 
                                            : 'bg-white hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleSongToggle(song.id)}
                                    >
                                        <div className="text-sm font-medium">
                                            {song.name}
                                            <span className="block text-xs text-gray-500">{song.artist}</span>
                                        </div>
                                        {selectedSongIds.includes(song.id) ? (
                                            <X size={16} className="text-red-500" />
                                        ) : (
                                            <Plus size={16} className="text-green-500" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No se encontraron canciones.</p>
                            )}
                        </div>

                        {/* Botón de Guardar */}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!currentService.date}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:bg-gray-400"
                            >
                                {currentService.id ? "Guardar Cambios" : "Crear Servicio"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ServiceSchedule;
