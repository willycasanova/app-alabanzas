// src/components/UpdateChecker.jsx

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '@/services/firebase'; // <--- ¡Esta es la línea corregida!
import Modal from './Modal';
import Message from './Message';
import { APP_VERSION } from '../constants/appInfo';

// Función para comparar versiones de forma numérica
const compareVersions = (version1, version2) => {
    const parts1 = version1.split('.').map(Number);
    const parts2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;

        if (part1 > part2) return 1;
        if (part1 < part2) return -1;
    }
    return 0;
};

function UpdateChecker() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // La referencia a la versión en Realtime Database, ajustada a tu estructura
        const versionRef = ref(rtdb, 'config/app_version');
        
        const unsubscribe = onValue(versionRef, (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const latestVersion = snapshot.val();
                    if (compareVersions(latestVersion, APP_VERSION) > 0) {
                        setUpdateAvailable(true);
                        setMessage({ type: 'info', text: '¡Una nueva versión de la app está disponible! 🚀 Por favor, actualiza para disfrutar de las últimas mejoras.' });
                    } else {
                        setUpdateAvailable(false);
                        setMessage(null);
                    }
                }
            } catch (error) {
                console.error("Error al verificar la versión de la app:", error);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUpdate = () => {
        window.location.reload(true);
    };

    if (!updateAvailable) {
        return null;
    }

    return (
        <Modal
            show={updateAvailable}
            onClose={() => setUpdateAvailable(false)}
            title="¡Actualización Disponible!"
            customZIndex="z-[60]"
        >
            {message && (
                <Message type={message.type} message={message.text} />
            )}
            <div className="p-4 text-center">
                <p className="text-gray-700 mb-4">La versión actual es **{APP_VERSION}**.</p>
                <button
                    onClick={handleUpdate}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
                >
                    Actualizar ahora
                </button>
            </div>
        </Modal>
    );
}

export default UpdateChecker;