// src/utils/dateUtils.js

/**
 * Formatea una fecha en una cadena YYYY-MM-DD.
 * @param {Date} date - El objeto de fecha a formatear.
 * @returns {string} La fecha formateada como YYYY-MM-DD.
 */
export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Obtiene el inicio de la semana (domingo) para una fecha dada.
 * @param {Date} date - La fecha de referencia.
 * @returns {Date} Un objeto Date que representa el domingo de la semana de la fecha dada.
 */
export const getStartOfWeek = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay()); // Retrocede al domingo
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Parsea una cadena de fecha YYYY-MM-DD en un objeto Date.
 * @param {string} dateString - La cadena de fecha en formato YYYY-MM-DD.
 * @returns {Date} El objeto Date correspondiente.
 */
export const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};
