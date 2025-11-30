import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { 
    getFirestore, 
    setDoc, 
    doc, 
    collection 
} from "firebase/firestore";
// Importar Realtime Database para evitar el error de importación externa
import { getDatabase } from "firebase/database"; 

// --- Variables globales de Canvas (MANDATORIAS) ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config) 
    : { 
        // --- CONFIGURACIÓN DE FALLBACK PARA ENTORNO LOCAL ---
        // IMPORTANTE: Si estás ejecutando esto localmente, reemplaza los valores "dummy-" 
        // con tu configuración REAL de Firebase para evitar el error "auth/api-key-not-valid".
        apiKey: "AIzaSyAGHUPrAc0WORIXktKF7gmdgZD2_CRr2Oc",
        authDomain: "app-canciones-de-alabanza.firebaseapp.com",
        databaseURL: "https://app-canciones-de-alabanza-default-rtdb.firebaseio.com",
        projectId: "app-canciones-de-alabanza",
        storageBucket: "app-canciones-de-alabanza.firebasestorage.app",
        messagingSenderId: "141052299849",
        appId: "1:141052299849:web:0e3dbb01cd0eabe961cd98",
        measurementId: "G-R72S3V5EG6",
        // Aquí se pueden agregar otros campos como databaseURL o measurementId si son necesarios.
    };
const initialAuthToken = typeof __initial_auth_token !== 'undefined' 
    ? __initial_auth_token 
    : null;

// 1. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// Inicializar Realtime Database (rtdb)
const rtdb = getDatabase(app); 

// 2. Función para iniciar sesión automáticamente o anónimamente
const initializeAuth = async () => {
    try {
        if (initialAuthToken) {
            // Usar el token personalizado si está disponible (entorno Canvas)
            await signInWithCustomToken(auth, initialAuthToken);
            console.log("Firebase initialized and signed in with custom token.");
        } else {
            // Usar inicio de sesión anónimo si el token no está disponible (fallback)
            await signInAnonymously(auth);
            console.log("Firebase initialized and signed in anonymously.");
        }
    } catch (error) {
        // Manejo específico del error "auth/api-key-not-valid" para que la app no muera.
        if (error.code === "auth/api-key-not-valid" || error.code === "auth/invalid-api-key") {
            console.warn("Authentication failed due to invalid API key. Running in unauthenticated mode.", error);
        } else {
            console.error("Error during initial Firebase sign-in:", error);
        }
    }
};

// Iniciar el proceso de autenticación inmediatamente
initializeAuth();

// Exportar instancias, incluyendo rtdb
export { db, auth, signOut, rtdb };

// Exportar la función de control para uso en AuthContext (si es necesario)
export { onAuthStateChanged };
