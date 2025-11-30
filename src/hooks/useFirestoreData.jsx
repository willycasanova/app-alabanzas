import { useState, useEffect, useCallback, useMemo } from "react";
// Importar db y auth desde nuestro servicio de Firebase
import { db, auth } from "../services/firebase.js"; 
// Importar TODAS las funciones de Firestore DIRECTAMENTE desde 'firebase/firestore'
import {
    collection,
    onSnapshot,
    setDoc, 
    doc,
    query,
    where
} from "firebase/firestore"; 

import { useAuth } from "../context/AuthContext.jsx";
import { format } from "date-fns";

const __app_id = "alabanza-app-v1"; 

// CAMBIO: Añadimos una comprobación de existencia para setMessage en todo el hook
export const useFirestoreData = (setMessage) => { 
    // ... (Inicialización de estados y useAuth - SIN CAMBIOS)
    const { user } = useAuth();
    const [songs, setSongs] = useState([]); 
    const [assignedSongs, setAssignedSongs] = useState([]); 
    const [dailyNotes, setDailyNotes] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Asegura que el userId se obtenga correctamente del AuthContext
    useEffect(() => {
        if (user && user.uid) {
            setUserId(user.uid);
        } else if (user === null) {
            // Manejar caso no autenticado o no disponible
            setIsLoading(false); 
        }
    }, [user]);

    // Función de utilidad para obtener la ruta de la colección pública
    const getPublicCollectionPath = (collectionName) => 
        `artifacts/${__app_id}/public/data/${collectionName}`;

    // Función de utilidad para obtener la ruta de la colección privada del usuario
    const getUserCollectionPath = (collectionName) => {
        if (!userId) return null;
        return `artifacts/${__app_id}/users/${userId}/${collectionName}`;
    };

    // ---------------------------------------------------
    // 1. OBTENCIÓN DE DATOS EN TIEMPO REAL (onSnapshot)
    // ---------------------------------------------------

    // Listener de Canciones (Público)
    useEffect(() => {
        const songsCollectionPath = getPublicCollectionPath("songs");
        
        if (!userId || !songsCollectionPath) {
            setIsLoading(true);
            return;
        }
        
        const q = query(collection(db, songsCollectionPath));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const songList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSongs(songList);
            setIsLoading(false);
            // Aplicar comprobación
            if (setMessage) setMessage({ text: "Datos de canciones actualizados.", type: "success" });
        }, (error) => {
            console.error("Error fetching songs:", error);
            // Aplicar comprobación
            if (setMessage) setMessage({ text: `Error al cargar canciones: ${error.message}`, type: "error" });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId, setMessage]); // Depende de userId Y setMessage para iniciar la escucha


    // Listener de Asignaciones (Público)
    useEffect(() => {
        const assignedSongsCollectionPath = getPublicCollectionPath("assigned_songs");
        
        if (!userId || !assignedSongsCollectionPath) return;

        const q = query(collection(db, assignedSongsCollectionPath));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const assignmentList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAssignedSongs(assignmentList);
        }, (error) => {
            console.error("Error fetching assigned songs:", error);
        });

        return () => unsubscribe();
    }, [userId]);


    // Listener de Notas Diarias (Privado - requiere userId)
    useEffect(() => {
        const dailyNotesCollectionPath = getUserCollectionPath("daily_notes");

        if (!userId || !dailyNotesCollectionPath) return;

        const q = query(collection(db, dailyNotesCollectionPath));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date ? doc.data().date : null 
            }));
            setDailyNotes(notesList);
        }, (error) => {
            console.error("Error fetching daily notes:", error);
        });

        return () => unsubscribe();
    }, [userId]);


    // ---------------------------------------------------
    // 2. FUNCIONES DE ESCRITURA (Acciones)
    // ---------------------------------------------------

    // GUARDAR NOTA DIARIA (Privado)
    const saveDailyNote = useCallback(async (date, content) => {
        if (!userId) {
            if (setMessage) setMessage({ text: "Error: Usuario no autenticado.", type: "error" });
            return;
        }

        const formattedDate = format(date, 'yyyy-MM-dd');
        const dailyNotesCollectionPath = getUserCollectionPath("daily_notes");
        const docRef = doc(db, dailyNotesCollectionPath, formattedDate);

        try {
            await setDoc(docRef, { 
                date: formattedDate, 
                content: content, 
                createdAt: new Date().toISOString(),
                userId: userId
            }, { merge: true }); 

            if (setMessage) setMessage({ text: `Nota del ${formattedDate} guardada exitosamente.`, type: "success" });
        } catch (e) {
            console.error("Error saving daily note: ", e);
            if (setMessage) setMessage({ text: `Fallo al guardar la nota: ${e.message}`, type: "error" });
        }
    }, [userId, setMessage]);


    // ASIGNAR CANCIONES (Público - usa setDoc con ID de fecha)
    const assignSongsToDay = useCallback(async (date, songIds, notes) => {
        if (!userId) {
            if (setMessage) setMessage({ text: "Error: Usuario no autenticado.", type: "error" });
            return;
        }

        const formattedDate = format(date, 'yyyy-MM-dd');
        const assignedSongsCollectionPath = getPublicCollectionPath("assigned_songs");
        const docRef = doc(db, assignedSongsCollectionPath, formattedDate);

        try {
            await setDoc(docRef, {
                date: formattedDate,
                songIds: songIds,
                notes: notes,
                assignedBy: userId,
                assignedAt: new Date().toISOString()
            });

            if (setMessage) setMessage({ text: `Canciones asignadas para el ${formattedDate} exitosamente.`, type: "success" });
        } catch (e) {
            console.error("Error assigning songs: ", e);
            if (setMessage) setMessage({ text: `Fallo al asignar canciones: ${e.message}`, type: "error" });
        }
    }, [userId, setMessage]);


    return {
        songs,
        assignedSongs,
        dailyNotes,
        isLoading,
        saveDailyNote,
        assignSongsToDay,
        userId 
    };
};
