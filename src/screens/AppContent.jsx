import React from 'react';
import CalendarView from '../components/CalendarView.jsx';
import SongLibrary from '../components/SongLibrary.jsx';
import { LogOut, Music, Calendar } from 'lucide-react';

const AppContent = ({
    user, songs, assignedSongs, dailyNotes, isLoading,
    handleLogout, handleDayClick, addSong, updateSong, deleteSong,
    openSongDetails, startLivePerformance, isAdmin,
    message, messageType, setMessage, setMessageType
}) => {
    // Definimos el contenido de la pestaña activa
    const [activeTab, setActiveTab] = React.useState('library');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-xl text-gray-700 font-semibold">Cargando datos de usuario...</p>
            </div>
        );
    }

    // Componente de Mensajes/Notificaciones
    const Notification = ({ message, type, onClose }) => {
        if (!message) return null;
        
        let colorClasses;
        switch (type) {
            case 'success':
                colorClasses = "bg-green-100 border-green-400 text-green-700";
                break;
            case 'error':
                colorClasses = "bg-red-100 border-red-400 text-red-700";
                break;
            case 'info':
            default:
                colorClasses = "bg-blue-100 border-blue-400 text-blue-700";
                break;
        }

        return (
            <div className={`fixed bottom-4 right-4 p-4 border rounded-lg shadow-lg z-50 transition-opacity duration-300 ${colorClasses}`}>
                <div className="flex justify-between items-start">
                    <p className="font-medium">{message}</p>
                    <button 
                        onClick={onClose} 
                        className={`ml-4 text-xl font-bold leading-none ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}
                        aria-label="Cerrar notificación"
                    >
                        &times;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-700">
                        App de Canciones
                    </h1>
                    <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-600 hidden sm:block">
                            Usuario: <span className="font-semibold">{user.email}</span>
                        </p>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-150 text-sm"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
                {/* Tabs de Navegación */}
                <div className="border-b border-gray-200">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('library')}
                            className={`flex items-center space-x-2 py-3 px-1 text-sm font-medium transition duration-150 ${
                                activeTab === 'library'
                                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Music size={20} />
                            <span>Librería de Canciones</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`flex items-center space-x-2 py-3 px-1 text-sm font-medium transition duration-150 ${
                                activeTab === 'calendar'
                                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Calendar size={20} />
                            <span>Calendario y Notas</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                {activeTab === 'library' && (
                    <SongLibrary
                        songs={songs}
                        addSong={addSong}
                        updateSong={updateSong}
                        deleteSong={deleteSong}
                        openSongDetails={openSongDetails}
                        startLivePerformance={startLivePerformance}
                        isAdmin={isAdmin}
                        setMessage={setMessage}
                        setMessageType={setMessageType}
                    />
                )}
                {activeTab === 'calendar' && (
                    <CalendarView
                        assignedSongs={assignedSongs}
                        dailyNotes={dailyNotes}
                        handleDayClick={handleDayClick}
                    />
                )}
            </main>

            {/* Notificación Flotante */}
            <Notification 
                message={message} 
                type={messageType} 
                onClose={() => { setMessage(""); setMessageType(""); }} 
            />
        </div>
    );
};

export default AppContent;
