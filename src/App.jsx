import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics"; // <-- Asegurado que esta línea no esté presente

// Importaciones de componentes desde la carpeta 'components'
import Modal from './components/Modal';
import UserNameInputModal from './components/UserNameInputModal';
import AddSongModal from './components/AddSongModal';
import EditSongModal from './components/EditSongModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import SongDetailsModal from './components/SongDetailsModal';
// Importa el componente de modal unificado con el nombre que usamos en el código
import NotesAndAssignmentsUnifiedModal from './components/NotesAndAssignmentsModal'; // <-- RUTA Y NOMBRE DE ARCHIVO CORREGIDOS

// Importa las funciones de utilidad de fecha desde el nuevo archivo
import { formatDate } from './utils/dateUtils';


// --- VERSIÓN DEL CÓDIGO PARA DEPURACIÓN ---
// Si ves este mensaje en la consola, estás ejecutando la versión: v2025-07-27o (Analytics deshabilitado explícitamente)
console.log("App.jsx Version: v2025-07-27o (Analytics deshabilitado explícitamente)");
// ------------------------------------------

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAGHUPrAc0WORIXktKF7gmdgZD2_CRr2Oc", // Usa tu clave API real
    authDomain: "app-canciones-de-alabanza.firebaseapp.com",
    projectId: "app-canciones-de-alabanza",
    storageBucket: "app-canciones-de-alabanza.appspot.com",
    messagingSenderId: "141052299849",
    appId: "1:141052299849:web:0e3dbb01cd0eabe961cd98",
    // measurementId: "G-R72S3V5EG6" // Ya eliminada
};

// 1. Inicializa la aplicación de Firebase PRIMERO
// Modificación clave: Añadir `enableAnalytics: false` en las opciones de inicialización
const app = initializeApp(firebaseConfig, {
    // Deshabilita explícitamente la recopilación de Analytics
    // Esto es crucial para evitar el error 'Cannot access 'oa' before initialization'
    // si no estás usando Analytics activamente.
    enableAnalytics: false
});

// 2. Extrae el projectId como appId, para que sea globalmente accesible donde se necesite
const appId = firebaseConfig.projectId;

// 3. Luego, inicializa otros servicios usando la variable 'app'
const db = getFirestore(app);
const auth = getAuth(app);

// Lista de versículos bíblicos (puedes añadir más)
const bibleVerses = [
    { text: "Todo lo puedo en Cristo que me fortalece.", reference: "Filipenses 4:13" },
    { text: "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.", reference: "Mateo 18:20" },
    { text: "Jehová es mi pastor; nada me faltará.", reference: "Salmo 23:1" },
    { text: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia, y él enderezará tus veredas.", reference: "Proverbios 3:5" },
    { text: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", reference: "Mateo 6:33" },
    { text: "El Señor es mi luz y mi salvación; ¿a quién temeré?", reference: "Salmo 27:1" },
    { text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel en él cree, no se pierda, mas tenga vida eterna.", reference: "Juan 3:16" },
    { text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", reference: "Mateo 11:28" },
    { text: "Porque yo sé los planes que tengo para vosotros, planes de bienestar y no de calamidad, para daros un futuro y una esperanza.", reference: "Jeremías 29:11" },
    { text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.", reference: "Juan 14:27" },
];


// Main App Component
const App = () => {
    // Existing states for Song Management
    const [songs, setSongs] = useState([]);
    const [newSongName, setNewSongName] = useState('');
    const [newSongKey, setNewSongKey] = useState('');
    const [newSongSheetMusicLink, setNewSongSheetMusicLink] = useState('');
    const [newSongVideoLink, setNewSongVideoLink] = useState('');
    const [editingSongId, setEditingSongId] = useState(null);
    const [editingSongName, setEditingSongName] = useState('');
    const [editingSongKey, setEditingSongKey] = useState('');
    const [editingSongSheetMusicLink, setEditingSongSheetMusicLink] = useState('');
    const [editingSongVideoLink, setEditingSongVideoLink] = useState('');
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentUserId, setCurrentUserId] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [showAddSongModal, setShowAddSongModal] = useState(false);
    const [showEditSongModal, setShowEditSongModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [songToDeleteId, setSongToDeleteId] = useState(null);

    // Existing states for Calendar
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showNotesModal, setShowNotesModal] = useState(false); // Ahora controla el modal unificado
    const [dailyNotes, setDailyNotes] = useState({}); // Stores 'notes' field for each date
    const [assignedSongs, setAssignedSongs] = useState({}); // Stores 'assignedSongs' field for each date
    const [selectedSongsForSunday, setSelectedSongsForSunday] = useState([]);
    const [sundayDateToAssign, setSundayDateToAssign] = useState(null);

    // New state for loading
    const [isLoading, setIsLoading] = useState(true); // Inicialmente en true

    // Existing states for song details display
    const [selectedSongDetails, setSelectedSongDetails] = useState(null);
    const [showSongDetailsModal, setShowSongDetailsModal] = useState(false);

    // Existing states for user personalization
    const [userName, setUserName] = useState('');
    const [inputUserName, setInputUserName] = useState(''); // Estado para el input del modal
    const [showNameInputModal, setShowNameInputModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [currentBibleVerse, setCurrentBibleVerse] = useState(null);

    // App URL for sharing
    const appUrl = "https://app-canciones-de-alabanza.web.app"; // eslint-disable-line no-unused-vars

    // --- AUTHENTICATION AND INITIAL DATA FETCHING ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUserId(user.uid);
            } else {
                try {
                    await signInAnonymously(auth);
                } catch (error) {
                    console.error("Error signing in anonymously:", error);
                    setMessage("Error de autenticación. Inténtalo de nuevo.");
                    setMessageType('error');
                }
            }
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, [auth, setMessage, setMessageType]);

    // Fetch user name and set random Bible verse on auth ready
    useEffect(() => {
        if (isAuthReady && currentUserId) {
            const userProfileDocRef = doc(db, `artifacts/${appId}/users/${currentUserId}/profile/user_data`);

            const fetchUserName = async () => {
                try {
                    const docSnap = await getDoc(userProfileDocRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUserName(userData.name || '');
                        setInputUserName(userData.name || '');
                    } else {
                        setShowNameInputModal(true);
                    }
                } catch (error) {
                    console.error("Error fetching user name:", error);
                    setMessage("Error al cargar tu nombre. Asegúrate de que las reglas de seguridad de Firestore estén configuradas correctamente.", 'error');
                    setMessageType('error');
                }
            };

            fetchUserName();
        }
    }, [isAuthReady, currentUserId, db, appId, setMessage, setMessageType]);

    // Firestore Listeners for Songs, Daily Notes (which now include assigned songs)
    useEffect(() => {
        if (!isAuthReady || !currentUserId) {
            setIsLoading(true);
            return;
        }

        let unsubscribeSongs, unsubscribeNotes;
        let songsLoaded = false;
        let notesAndAssignedSongsLoaded = false;

        const checkAllLoaded = () => {
            if (songsLoaded && notesAndAssignedSongsLoaded) {
                setIsLoading(false);
            }
        };

        const songsRef = collection(db, `songs`);
        unsubscribeSongs = onSnapshot(songsRef, (snapshot) => {
            const songsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSongs(songsData);
            songsLoaded = true;
            checkAllLoaded();
        }, (error) => {
            console.error("Error fetching songs:", error);
            setMessage("Error al cargar canciones.", 'error');
            setMessageType('error');
            songsLoaded = true;
            checkAllLoaded();
        });

        const dailyNotesCollectionRef = collection(db, `dailyNotes`);
        unsubscribeNotes = onSnapshot(dailyNotesCollectionRef, (snapshot) => {
            const notesData = {};
            const assignedSongsData = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                notesData[doc.id] = data.notes || '';
                const songsArray = data.assignedSongs && Array.isArray(data.assignedSongs) ? data.assignedSongs : [];
                assignedSongsData[doc.id] = songsArray;
            });
            setDailyNotes(notesData);
            setAssignedSongs(assignedSongsData);
            notesAndAssignedSongsLoaded = true;
            checkAllLoaded();
        }, (error) => {
            console.error("Error fetching daily notes and assigned songs:", error);
            setMessage("Error al cargar notas diarias y canciones asignadas.", 'error');
            setMessageType('error');
            notesAndAssignedSongsLoaded = true;
            checkAllLoaded();
        });

        return () => {
            unsubscribeSongs && unsubscribeSongs();
            unsubscribeNotes && unsubscribeNotes();
        };
    }, [isAuthReady, currentUserId, db, setMessage, setMessageType]);

    // --- CALENDAR FUNCTIONS ---
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendarDays = useCallback(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-pre-${i}`} className="calendar-day empty"></div>);
        }

        for (let i = 1; i <= numDays; i++) {
            try {
                const date = new Date(year, month, i);
                const formattedDateStr = formatDate(date);
                const isToday = formatDate(new Date()) === formattedDateStr;
                const isSelected = selectedDate && formatDate(selectedDate) === formattedDateStr;
                const hasNote = !!dailyNotes[formattedDateStr];

                const currentDayAssignedSongs = (assignedSongs && typeof assignedSongs === 'object' && Array.isArray(assignedSongs[formattedDateStr]))
                    ? assignedSongs[formattedDateStr]
                    : [];

                const hasAssignedSongs = currentDayAssignedSongs.length > 0;
                const isSunday = date.getDay() === 0;

                days.push(
                    <div
                        key={`day-${i}`}
                        className={`calendar-day relative p-2 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
                                 ${isToday ? 'bg-indigo-200' : 'bg-white'}
                                 ${isSelected ? 'border-2 border-indigo-500 bg-indigo-100' : 'border-gray-200 hover:bg-gray-50'}
                                 ${isSunday ? 'text-red-600 font-bold' : ''}`}
                        onClick={() => handleDateClick(date)}
                    >
                        <span className="text-xl font-semibold">{i}</span>
                        {hasNote && (
                            <span className="absolute bottom-1 left-1.5 text-xs text-blue-500">📝</span>
                        )}
                        {hasAssignedSongs && (
                            <span className="absolute bottom-1 right-1.5 text-xs text-green-500">🎶</span>
                        )}
                    </div>
                );
            } catch (error) {
                console.error(`Error rendering calendar day ${i}:`, error);
                days.push(<div key={`error-day-${i}`} className="calendar-day error">Error</div>);
            }
        }

        const totalDaysDisplayed = days.length;
        const remainingCells = (7 - (totalDaysDisplayed % 7)) % 7;
        for (let i = 0; i < remainingCells; i++) {
            days.push(<div key={`empty-post-${i}`} className="calendar-day empty"></div>);
        }

        return days;
    }, [currentMonth, selectedDate, dailyNotes, assignedSongs, handleDateClick, formatDate, daysInMonth, firstDayOfMonth]);


    const handleDateClick = (date) => {
        setSelectedDate(date);
        const formattedDate = formatDate(date);

        const isSelectedDateSunday = date.getDay() === 0;

        if (isSelectedDateSunday) {
            setSundayDateToAssign(date);
            const currentAssignedSongIds = (assignedSongs && typeof assignedSongs === 'object' && Array.isArray(assignedSongs[formattedDate]))
                ? assignedSongs[formattedDate]
                : [];
            setSelectedSongsForSunday(currentAssignedSongIds);
        } else {
            setSundayDateToAssign(null);
            setSelectedSongsForSunday([]);
        }

        setShowNotesModal(true);
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1);
            return newMonth;
        });
    };

    const goToNextMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);
            return newMonth;
        });
    };

    const goToCurrentMonth = () => {
        setCurrentMonth(new Date());
    };

    // --- SONG MANAGEMENT FUNCTIONS ---

    const addSong = async () => {
        if (!newSongName.trim()) {
            setMessage("El nombre de la canción no puede estar vacío.", 'error');
            setMessageType('error');
            return;
        }
        try {
            const songsCollectionRef = collection(db, `songs`);
            await addDoc(songsCollectionRef, {
                name: newSongName,
                key: newSongKey,
                sheetMusicLink: newSongSheetMusicLink,
                videoLink: newSongVideoLink,
                createdAt: new Date(),
            });
            setMessage("Canción añadida con éxito.", 'success');
            setMessageType('success');
            setNewSongName('');
            setNewSongKey('');
            setNewSongSheetMusicLink('');
            setNewSongVideoLink('');
            setShowAddSongModal(false);
        } catch (error) {
            console.error("Error adding song:", error);
            setMessage("Error al añadir la canción.", 'error');
            setMessageType('error');
        }
    };

    const startEditSong = (song) => {
        setEditingSongId(song.id);
        setEditingSongName(song.name);
        setEditingSongKey(song.key);
        setEditingSongSheetMusicLink(song.sheetMusicLink);
        setEditingSongVideoLink(song.videoLink);
        setShowEditSongModal(true);
    };

    const updateSong = async () => {
        if (!editingSongId) return;
        if (!editingSongName.trim()) {
            setMessage("El nombre de la canción no puede estar vacío.", 'error');
            setMessageType('error');
            return;
        }
        try {
            const songDocRef = doc(db, `songs`, editingSongId);
            await setDoc(songDocRef, {
                name: editingSongName,
                key: editingSongKey,
                sheetMusicLink: editingSongSheetMusicLink,
                videoLink: editingSongVideoLink,
            }, { merge: true });
            setMessage("Canción actualizada con éxito.", 'success');
            setMessageType('success');
            setEditingSongId(null);
            setEditingSongName('');
            setEditingSongKey('');
            setEditingSongSheetMusicLink('');
            setEditingSongVideoLink('');
            setShowEditSongModal(false);
        } catch (error) {
            console.error("Error updating song:", error);
            setMessage("Error al actualizar la canción.", 'error');
            setMessageType('error');
        }
    };

    const confirmDeleteSong = (songId) => {
        setSongToDeleteId(songId);
        setShowConfirmDeleteModal(true);
    };

    const deleteSong = async () => {
        if (!songToDeleteId) return;
        try {
            const songDocRef = doc(db, `songs`, songToDeleteId);
            await deleteDoc(songDocRef);
            setMessage("Canción eliminada con éxito.", 'success');
            setMessageType('success');
            setSongToDeleteId(null);
            setShowConfirmDeleteModal(false);
        } catch (error) {
            console.error("Error deleting song:", error);
            setMessage("Error al eliminar la canción.", 'error');
            setMessageType('error');
        }
    };

    // --- DAILY NOTES AND ASSIGNMENTS ---

    const saveDailyNote = useCallback(async (noteToSave) => {
        if (!selectedDate) return;
        const formattedDateStr = formatDate(selectedDate);
        try {
            const dailyNoteDocRef = doc(db, `dailyNotes`, formattedDateStr);
            await setDoc(dailyNoteDocRef, {
                notes: noteToSave,
                assignedSongs: assignedSongs[formattedDateStr] || [],
            }, { merge: true });
            setMessage("Nota guardada con éxito.", 'success');
            setMessageType('success');
            setDailyNotes(prevNotes => ({
                ...prevNotes,
                [formattedDateStr]: noteToSave
            }));
        } catch (error) {
            console.error("Error al guardar la nota diaria:", error);
            setMessage("Error al guardar la nota.", 'error');
            setMessageType('error');
        }
    }, [selectedDate, assignedSongs, setMessage, setMessageType, setDailyNotes, db, formatDate]);

    const assignSongsToSunday = useCallback(async () => {
        if (!sundayDateToAssign) return;
        const formattedSunday = formatDate(sundayDateToAssign);

        try {
            const dailyNoteDocRef = doc(db, `dailyNotes`, formattedSunday);
            await setDoc(dailyNoteDocRef, {
                notes: dailyNotes[formattedSunday] || '',
                assignedSongs: selectedSongsForSunday,
            }, { merge: true });
            setMessage("Canciones asignadas con éxito.", 'success');
            setMessageType('success');
            setShowNotesModal(false);
        } catch (error) {
            console.error("Error al asignar canciones:", error);
            setMessage("Error al asignar canciones.", 'error');
            setMessageType('error');
        }
    }, [sundayDateToAssign, selectedSongsForSunday, dailyNotes, setMessage, setMessageType, db, formatDate]);

    const openSongDetails = (song) => {
        setSelectedSongDetails(song);
        setShowSongDetailsModal(true);
    };

    const closeSongDetailsModal = () => {
        setShowSongDetailsModal(false);
        setSelectedSongDetails(null);
    };

    // --- USER PERSONALIZATION ---

    const saveUserName = useCallback(async (name) => {
        if (!currentUserId) {
            console.error("No hay usuario autenticado para guardar el nombre.");
            setMessage("Error: No se pudo guardar el nombre. No hay usuario autenticado.", 'error');
            setMessageType('error');
            return;
        }
        try {
            const userProfileDocRef = doc(db, `artifacts/${appId}/users/${currentUserId}/profile/user_data`);
            await setDoc(userProfileDocRef, { name: name }, { merge: true });
            setUserName(name);
            setMessage("Nombre guardado con éxito.", 'success');
            setMessageType('success');
            setShowNameInputModal(false);
        } catch (error) {
            console.error("Error saving user name:", error);
            setMessage("Error al guardar tu nombre. Asegúrate de que las reglas de seguridad de Firestore estén configuradas correctamente.", 'error');
            setMessageType('error');
        }
    }, [currentUserId, db, appId, setMessage, setMessageType, setUserName]);

    // Set random Bible verse on component mount or user name change
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * bibleVerses.length);
        setCurrentBibleVerse(bibleVerses[randomIndex]);
    }, [userName]);

    // --- RENDERING ---

    if (!isAuthReady || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg">Cargando aplicación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="bg-white shadow-md rounded-lg p-4 mb-6 text-center">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
                    {userName ? `Bienvenido/a, ${userName}!` : "App Canciones de Alabanza"}
                </h1>
                {currentBibleVerse && (
                    <p className="text-lg italic text-gray-600">
                        "{currentBibleVerse.text}" - <span className="font-semibold">{currentBibleVerse.reference}</span>
                    </p>
                )}
            </header>

            {message && (
                <div className={`p-3 rounded-md mb-4 text-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel de Gestión de Canciones */}
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Gestión de Canciones</h2>
                    <button
                        onClick={() => setShowAddSongModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 mb-6 w-full text-lg"
                    >
                        Añadir Nueva Canción
                    </button>

                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                        {songs.length === 0 ? (
                            <p className="p-4 text-gray-500 text-center">No hay canciones añadidas aún.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {songs.map(song => (
                                    <li key={song.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-semibold text-gray-900">{song.name}</h3>
                                            <p className="text-gray-600">Tonalidad: {song.key}</p>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => openSongDetails(song)}
                                                className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                                title="Ver Detalles"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                onClick={() => startEditSong(song)}
                                                className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => confirmDeleteSong(song.id)}
                                                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                {/* Panel de Calendario y Asignaciones */}
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Calendario y Asignaciones</h2>
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={goToPreviousMonth} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                            &lt; Anterior
                        </button>
                        <h3 className="text-2xl font-semibold text-gray-800">
                            {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={goToNextMonth} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                            Siguiente &gt;
                        </button>
                    </div>
                    <div className="grid grid-cols-7 text-center font-bold text-gray-700 mb-2">
                        <div>Dom</div>
                        <div>Lun</div>
                        <div>Mar</div>
                        <div>Mié</div>
                        <div>Jue</div>
                        <div>Vie</div>
                        <div>Sáb</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {renderCalendarDays()}
                    </div>
                </section>
            </div>

            {/* Modals */}
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
                addSong={addSong}
            />

            <EditSongModal
                show={showEditSongModal}
                onClose={() => setShowEditSongModal(false)}
                editingSongName={editingSongName}
                setEditingSongName={setEditingSongName}
                editingSongKey={editingSongKey}
                setEditingSongKey={setEditingSongKey}
                editingSongSheetMusicLink={editingSongSheetMusicLink}
                setEditingSongSheetMusicLink={setEditingSongSheetMusicLink}
                editingSongVideoLink={editingSongVideoLink}
                setEditingSongVideoLink={setEditingSongVideoLink}
                updateSong={updateSong}
            />

            <ConfirmDeleteModal
                show={showConfirmDeleteModal}
                onClose={() => setShowConfirmDeleteModal(false)}
                onConfirm={deleteSong}
                message="¿Estás seguro de que quieres eliminar esta canción? Esta acción no se puede deshacer."
            />

            <SongDetailsModal
                show={showSongDetailsModal}
                onClose={closeSongDetailsModal}
                song={selectedSongDetails}
            />

            <NotesAndAssignmentsUnifiedModal
                show={showNotesModal}
                onClose={() => setShowNotesModal(false)}
                selectedDate={selectedDate}
                initialNoteValue={dailyNotes[formatDate(selectedDate)] || ''} // Pasa la nota para inicializar el estado local del modal
                saveDailyNote={saveDailyNote} // La función saveDailyNote en App.jsx ahora espera la nota como argumento
                isSunday={selectedDate && selectedDate.getDay() === 0}
                songs={songs} // Asegúrate de que esta prop se siga pasando para la pestaña de asignación
                sundayAssignedSongIds={assignedSongs[formatDate(selectedDate)] || []}
                setSundayAssignedSongIds={(ids) => {
                    // Actualiza el estado local de assignedSongs en App
                    setAssignedSongs(prevAssigned => ({
                        ...prevAssigned,
                        [formatDate(selectedDate)]: ids
                    }));
                }}
                assignSongsToSunday={assignSongsToSunday}
                openSongDetails={openSongDetails}
                setMessage={setMessage}
                setMessageType={setMessageType}
            />

            <UserNameInputModal
                show={showNameInputModal}
                onClose={() => setShowNameInputModal(false)}
                inputUserName={inputUserName}
                setInputUserName={setInputUserName}
                onSave={saveUserName} // Pasa la función de guardar nombre
            />

        </div>
    );
};

export default App;
