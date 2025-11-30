import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

/**
 * Componente de notificación flotante para mostrar mensajes de feedback.
 * @param {string} message - El texto del mensaje.
 * @param {string} type - Tipo de mensaje ('success', 'error', 'warning').
 * @param {function} onClear - Función para ocultar el mensaje.
 */
const Message = ({ message, type, onClear }) => {
    // Determina los colores y el ícono basado en el tipo
    let bgColor, borderColor, icon, iconColor;

    switch (type) {
        case 'success':
            bgColor = 'bg-green-100';
            borderColor = 'border-green-500';
            icon = CheckCircle;
            iconColor = 'text-green-600';
            break;
        case 'error':
            bgColor = 'bg-red-100';
            borderColor = 'border-red-500';
            icon = XCircle;
            iconColor = 'text-red-600';
            break;
        case 'warning':
            bgColor = 'bg-yellow-100';
            borderColor = 'border-yellow-500';
            icon = AlertTriangle;
            iconColor = 'text-yellow-600';
            break;
        default:
            bgColor = 'bg-gray-100';
            borderColor = 'border-gray-500';
            icon = AlertTriangle;
            iconColor = 'text-gray-600';
            break;
    }

    const IconComponent = icon;

    // Efecto para ocultar el mensaje automáticamente después de 5 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClear();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onClear]);

    if (!message) return null;

    return (
        <div 
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border-l-4 ${bgColor} ${borderColor} transition-transform duration-300 ease-out transform translate-y-0 opacity-100 w-full max-w-sm`}
            role="alert"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <IconComponent size={24} className={`mr-3 ${iconColor}`} />
                    <p className={`font-semibold text-sm ${iconColor.replace('-600', '-800')}`}>{message}</p>
                </div>
                <button onClick={onClear} className={`ml-4 ${iconColor} hover:opacity-75 transition`} aria-label="Cerrar notificación">
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default Message;
