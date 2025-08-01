import React, { useState, useEffect, useRef } from 'react';

const LivePerformanceMode = ({ setlist, onClose, setMessage, setMessageType }) => {
    // Definimos los estados con valores iniciales seguros
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const iframeRef = useRef(null);

    // --- VALIDACIÓN DE DATOS MÁS TEMPRANA Y CON RETORNO CONDICIONAL ---
    // Esta es la primera y más importante línea de defensa.
    // Si setlist, setlist.songs no son válidos, el componente retorna inmediatamente
    // un estado de carga o error, sin intentar acceder a 'length' ni a 'songs'.
    if (!setlist || !Array.isArray(setlist.songs) || setlist.songs.length === 0) {
        // Usamos useEffect para efectos secundarios como los mensajes y cerrar el modal.
        // Esto evita que se llamen funciones de setState en el cuerpo del render.
        useEffect(() => {
            console.error("LivePerformanceMode: Setlist inválido o vacío al intentar renderizar.", setlist);
            if (setlist && Array.isArray(setlist.songs) && setlist.songs.length === 0) {
                setMessage("El setlist está vacío. Por favor, añade canciones para iniciar el modo en vivo.", 'warning');
            } else {
                setMessage("No se pudo cargar el setlist o es inválido. Intentando cerrar el modo en vivo.", 'error');
            }
            onClose(); // Intenta cerrar el modo en vivo si el setlist es inválido o vacío
        }, [setMessage, onClose, setlist]); // Las dependencias aseguran que se ejecuta si 'setlist' cambia a un estado inválido

        // Renderiza un estado de carga/error inmediatamente para evitar cualquier otro cálculo.
        return (
            <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center flex-col p-4">
                <p className="text-xl mb-4 text-center">Cargando setlist o el setlist está vacío...</p>
                <button 
                    onClick={onClose} 
                    className="px-6 py-3 bg-rose-600 rounded-md hover:bg-rose-700 transition-colors duration-200 text-lg font-semibold"
                >
                    Volver
                </button>
            </div>
        );
    }
    // --- FIN DE LA VALIDACIÓN TEMPRANA ---

    // A partir de aquí, currentSong y setlist.songs.length son SEGUROS de usar.
    const currentSong = setlist.songs[currentSongIndex];

    // --- EFECTO PARA LA LÓGICA DE INICIALIZACIÓN Y TECLADO ---
    // Este useEffect se ejecuta solo cuando 'setlist' tiene un valor válido.
    useEffect(() => {
        setMessage(`Modo en vivo iniciado para: ${setlist.name}`, 'success'); 
        console.log(`LivePerformanceMode: Iniciado para setlist: ${setlist.name}. Total de canciones: ${setlist.songs.length}`);

        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                setCurrentSongIndex(prev => Math.min(prev + 1, setlist.songs.length - 1));
            } else if (event.key === 'ArrowLeft') {
                setCurrentSongIndex(prev => Math.max(prev - 1, 0));
            } else if (event.key === 'Escape') {
                onClose();
            } else if (event.key === ' ') {
                event.preventDefault(); // Evita el scroll de la página al pulsar espacio
                setShowControls(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setlist, onClose, setMessage, setMessageType]); // Dependencias para re-ejecutar si el setlist cambia

    // --- EFECTO PARA LA CANCIÓN ACTUAL (si es necesario) ---
    // Este efecto solo se ocupa de la lógica de la canción actual.
    useEffect(() => {
        // console.log(`LivePerformanceMode: Mostrando canción: ${currentSong.name} (Index: ${currentSongIndex})`);
        // Lógica adicional aquí si se necesita interactuar con la API del reproductor de YouTube
        // (ej. pausar videos cuando se cambia de canción), pero no para la recarga básica.
    }, [currentSongIndex, currentSong.name]); // Dependencias: solo cuando el índice o el nombre de la canción cambian


    // Función para obtener la URL de incrustación de YouTube
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        // Expresión regular para extraer el ID de video de YouTube
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        
        // --- ¡¡¡ESTA ES LA LÍNEA CRÍTICA CORREGIDA PARA EL ENLACE DE YOUTUBE!!! ---
        // Se usa `http://www.youtube.com/embed/` para la URL de incrustación de YouTube oficial.
        return match && match[1] ? `http://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
    };

    const embedVideoUrl = getYouTubeEmbedUrl(currentSong.videoLink);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4 sm:p-6 relative overflow-hidden">
            {/* Controles de Navegación y Salida */}
            {showControls && (
                <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row justify-between items-center bg-gray-800 bg-opacity-80 rounded-lg p-3 sm:p-4 shadow-lg">
                    <button
                        onClick={() => setCurrentSongIndex(prev => Math.max(prev - 1, 0))}
                        disabled={currentSongIndex === 0}
                        className="w-full sm:w-auto mb-2 sm:mb-0 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-base sm:text-lg font-semibold"
                    >
                        &lt; Anterior
                    </button>
                    <h2 className="text-xl sm:text-2xl font-bold text-white text-center flex-grow mx-0 sm:mx-4 truncate mb-2 sm:mb-0">
                        {setlist.name} - {currentSongIndex + 1}/{setlist.songs.length}
                    </h2>
                    <button
                        onClick={() => setCurrentSongIndex(prev => Math.min(prev + 1, setlist.songs.length - 1))}
                        disabled={currentSongIndex === setlist.songs.length - 1}
                        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-base sm:text-lg font-semibold"
                    >
                        Siguiente &gt;
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4 px-4 py-2 bg-rose-600 rounded-md hover:bg-rose-700 transition-colors duration-200 text-base sm:text-lg font-semibold"
                    >
                        Salir
                    </button>
                </div>
            )}

            {/* Contenido principal de la canción */}
            <div className="flex flex-col items-center justify-center w-full max-w-4xl h-full mt-[120px] sm:mt-24 mb-4 flex-grow relative">
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-emerald-400 mb-2 sm:mb-4 text-center tracking-tight leading-tight">
                    {currentSong.name}
                </h3>
                <p className="text-2xl sm:text-3xl md:text-4xl text-gray-300 font-semibold mb-4 sm:mb-8">
                    Tonalidad: <span className="text-emerald-300">{currentSong.key}</span>
                </p>

                {embedVideoUrl ? (
                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black mt-4">
                        <iframe
                            key={currentSong.id} // Añadir key para forzar remount del iframe
                            ref={iframeRef}
                            className="w-full h-full"
                            src={embedVideoUrl}
                            title={`Video de ${currentSong.name}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : currentSong.sheetMusicLink ? (
                    <div className="w-full flex-grow bg-gray-800 rounded-lg p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-2xl">
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 text-center">
                            <a
                                href={currentSong.sheetMusicLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:underline"
                            >
                                Haz clic aquí para ver la partitura/letra (se abrirá en una nueva pestaña)
                            </a>
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-lg sm:text-xl mt-8">
                        No hay enlaces de partitura o video disponibles para esta canción.
                    </p>
                )}
            </div>

            {/* Instrucciones de control */}
            {showControls && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center text-sm sm:text-lg text-gray-400 bg-gray-800 bg-opacity-80 rounded-lg p-2 sm:p-3 shadow-lg max-w-xs sm:max-w-xl w-full">
                    Usa las flechas ← → para navegar. Pulsa ESPACIO para ocultar/mostrar controles. ESC para salir.
                </div>
            )}
        </div>
    );
};

export default LivePerformanceMode;