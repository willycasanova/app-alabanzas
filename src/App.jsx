import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { 
    getFirestore, collection, addDoc, onSnapshot, query, 
    serverTimestamp, setLogLevel 
} from 'firebase/firestore';
import { Plus, X, Music, Key } from 'lucide-react'; // Iconos

// Configuración de Firebase y Variables Globales
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// ==============================================================================
// 1. Componente Modal (Requerido por AddSongModal)
// ==============================================================================
const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header del Modal */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 id="modal-title" className="text-xl font-bold text-gray-800 flex items-center">
                        {title}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition duration-150"
                        aria-label="Cerrar modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenido del Modal */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ==============================================================================
// 2. Componente AddSongModal (Basado en tu código)
// ==============================================================================
const AddSongModal = ({
    show,
    onClose,
    newSongName,
    setNewSongName,
    newSongKey,
    setNewSongKey,
    newSongSheetMusicLink,
    setNewSongSheetMusicLink,
    newSongVideoLink,
    setNewSongVideoLink,
    addSong // Propiedad para la función de añadir canción
}) => {
    const handleAddSongClick = () => {
        // Validación básica (puedes añadir más si es necesario)
        if (!newSongName.trim() || !newSongKey.trim()) {
            console.error("El nombre y la tonalidad de la canción son obligatorios.");
            // En una app real, mostrarías un mensaje de error al usuario.
            return;
        }
        
        addSong(); // Llama a la función del padre para guardar en Firestore
        // onClose(); // La función addSong en el App.jsx se encargará de cerrar el modal
    };

    return (
        <Modal show={show} onClose={onClose} title="Añadir Nueva Canción">
            <div className="space-y-4">
                <div>
                    <label htmlFor="newSongName" className="block text-sm font-medium text-gray-700">Nombre de la Canción:</label>
                    <input
                        type="text"
                        id="newSongName"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        value={newSongName}
                        onChange={(e) => setNewSongName(e.target.value)}
                        placeholder="Ej: Grande Es Tu Fidelidad"
                    />
                </div>
                <div>
                    <label htmlFor="newSongKey" className="block text-sm font-medium text-gray-700">Tonalidad:</label>
                    <input
                        type="text"
                        id="newSongKey"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        value={newSongKey}
                        onChange={(e) => setNewSongKey(e.target.value)}
                        placeholder="Ej: C, G, Am"
                    />
                </div>
                <div>
                    <label htmlFor="newSongSheetMusicLink" className="block text-sm font-medium text-gray-700">Enlace a partitura/letra:</label>
                    <input
                        type="url"
                        id="newSongSheetMusicLink"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        value={newSongSheetMusicLink}
                        onChange={(e) => setNewSongSheetMusicLink(e.target.value)}
                        placeholder="https://ejemplo.com/partitura.pdf"
                    />
                </div>
                <div>
                    <label htmlFor="newSongVideoLink" className="block text-sm font-medium text-gray-700">Enlace a video (YouTube, etc.):</label>
                    <input
                        type="url"
                        id="newSongVideoLink"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        value={newSongVideoLink}
                        onChange={(e) => setNewSongVideoLink(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        onClick={handleAddSongClick}
                        className="bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition duration-150 ease-in-out disabled:opacity-50"
                        disabled={!newSongName.trim() || !newSongKey.trim()} // Deshabilita si faltan datos esenciales
                    >
                        <Plus size={20} className="inline mr-2" />
                        Añadir Canción
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-md transition duration-150 ease-in-out"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// ==============================================================================
// 3. Componente Principal App
// ==============================================================================
const App = () => {
    // --- Estados de Firebase y Autenticación ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    
    // --- Estados de la Aplicación ---
    const [songs, setSongs] = useState([]);
    const [showAddSongModal, setShowAddSongModal] = useState(false);
    
    // --- Estados del Formulario del Modal ---
    const [newSongName, setNewSongName] = useState('');
    const [newSongKey, setNewSongKey] = useState('');
    const [newSongSheetMusicLink, setNewSongSheetMusicLink] = useState('');
    const [newSongVideoLink, setNewSongVideoLink] = useState('');
    
    // ----------------------------------------------------
    // Lógica de Inicialización y Autenticación de Firebase
    // ----------------------------------------------------
    useEffect(() => {
        setLogLevel('debug'); // Para ver logs de Firestore

        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const firebaseAuth = getAuth(app);
            
            setDb(firestore);
            setAuth(firebaseAuth);

            const handleAuthState = (user) => {
                if (user) {
                    setUserId(user.uid);
                    setLoadingAuth(false);
                } else {
                    // Si no hay usuario, intenta iniciar sesión anónimamente o con token
                    if (initialAuthToken) {
                        signInWithCustomToken(firebaseAuth, initialAuthToken)
                            .catch((error) => {
                                console.error("Error signing in with custom token:", error);
                                setErrorMessage("Error de autenticación: Token personalizado falló.");
                                setLoadingAuth(false);
                            });
                    } else {
                        signInAnonymously(firebaseAuth)
                            .then((result) => {
                                setUserId(result.user.uid);
                                setLoadingAuth(false);
                            })
                            .catch((error) => {
                                console.error("Error signing in anonymously:", error);
                                setErrorMessage("Error de autenticación anónima.");
                                setLoadingAuth(false);
                            });
                    }
                }
            };

            const unsubscribe = onAuthStateChanged(firebaseAuth, handleAuthState);
            
            return () => unsubscribe();
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            setErrorMessage("Error al inicializar Firebase. Revisa la configuración.");
            setLoadingAuth(false);
        }
    }, []);

    // ----------------------------------------------------
    // Lógica de Firestore para CRUD (Data Persistence)
    // ----------------------------------------------------

    // Función para obtener la referencia de la colección privada de canciones
    const getSongsCollectionRef = useCallback(() => {
        if (db && userId) {
            // Ruta de colección privada: /artifacts/{appId}/users/{userId}/songs
            return collection(db, 'artifacts', appId, 'users', userId, 'songs');
        }
        return null;
    }, [db, userId]);

    // Lógica para añadir una nueva canción a Firestore
    const addSong = async () => {
        const songsRef = getSongsCollectionRef();
        if (!songsRef) {
            setErrorMessage("Error: Base de datos o usuario no inicializado.");
            return;
        }

        const songData = {
            name: newSongName.trim(),
            key: newSongKey.trim(),
            sheetMusicLink: newSongSheetMusicLink.trim(),
            videoLink: newSongVideoLink.trim(),
            createdAt: serverTimestamp(),
            // No almacenamos userId en el documento ya que está en la ruta
        };

        try {
            await addDoc(songsRef, songData);
            
            // Limpiar el formulario y cerrar el modal al guardar exitosamente
            setNewSongName('');
            setNewSongKey('');
            setNewSongSheetMusicLink('');
            setNewSongVideoLink('');
            setShowAddSongModal(false);

        } catch (error) {
            console.error("Error adding document: ", error);
            setErrorMessage(`Error al añadir canción: ${error.message}`);
        }
    };
    
    // Lógica para suscribirse a cambios en la colección de canciones (onSnapshot)
    useEffect(() => {
        const songsRef = getSongsCollectionRef();
        let unsubscribe = () => {};

        if (songsRef) {
            const q = query(songsRef);
            
            // onSnapshot proporciona una escucha en tiempo real
            unsubscribe = onSnapshot(q, (snapshot) => {
                const songsList = [];
                snapshot.forEach((doc) => {
                    songsList.push({ id: doc.id, ...doc.data() });
                });
                
                // Ordenar localmente por nombre de canción (ya que orderBy requiere índices)
                songsList.sort((a, b) => a.name.localeCompare(b.name));
                setSongs(songsList);

            }, (error) => {
                console.error("Error fetching songs: ", error);
                setErrorMessage(`Error de subscripción a datos: ${error.message}`);
            });
        }

        // Cleanup function
        return () => unsubscribe();
    }, [getSongsCollectionRef]); // Dependencias para re-suscribirse si db/userId cambia

    // ----------------------------------------------------
    // UI Renderizado
    // ----------------------------------------------------

    if (loadingAuth) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-xl font-medium text-indigo-600">Cargando autenticación...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
            <header className="max-w-4xl mx-auto mb-6 bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center">
                    <Music className="w-8 h-8 mr-3 text-indigo-600"/>
                    Gestor de Repertorio
                </h1>
                <p className="text-gray-600">Tu repertorio personal sincronizado en tiempo real (ID de Usuario: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">{userId}</span>)</p>
            </header>

            <main className="max-w-4xl mx-auto">
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
                        <strong className="font-bold">¡Error!</strong>
                        <span className="block sm:inline ml-2">{errorMessage}</span>
                    </div>
                )}
                
                {/* Botón para abrir el modal */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setShowAddSongModal(true)}
                        className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-[1.02] flex items-center"
                    >
                        <Plus size={20} className="mr-2" />
                        Añadir Canción
                    </button>
                </div>
                
                {/* Lista de Canciones */}
                <div className="bg-white shadow-xl rounded-xl p-4 sm:p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">Lista de Canciones ({songs.length})</h2>
                    {songs.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 italic">
                            Aún no hay canciones. ¡Usa el botón "Añadir Canción" para empezar!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {songs.map((song) => (
                                <div key={song.id} className="border border-gray-100 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-150 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                                        <div className="text-lg font-bold text-indigo-700 truncate">{song.name}</div>
                                        <div className="text-sm text-gray-500 flex items-center mt-1">
                                            <Key size={16} className="text-gray-400 mr-1"/> 
                                            <span className="font-medium text-gray-700">{song.key || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap space-x-3 text-sm">
                                        {song.sheetMusicLink && (
                                            <a 
                                                href={song.sheetMusicLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
                                            >
                                                Partitura/Letra
                                            </a>
                                        )}
                                        {song.videoLink && (
                                            <a 
                                                href={song.videoLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
                                            >
                                                Video
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Inclusión del Modal */}
            <AddSongModal 
                show={showAddSongModal}
                onClose={() => setShowAddSongModal(false)}
                newSongName={newSongName}
                setNewSongName={setNewSongName}
                newSongKey={newSongKey}
                setNewSongKey={setNewSongKey}
                newSongSheetMusicLink={newSongSheetMusicLink}
                setNewSongSheetMusicLink={setNewSongSheetMusicLink}
                newSongVideoLink={newSongVideoLink}
                setNewSongVideoLink={setNewSongVideoLink}
                addSong={addSong} // La función de guardar en Firestore
            />
        </div>
    );
};

export default App;
