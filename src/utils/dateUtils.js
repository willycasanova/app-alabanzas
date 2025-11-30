export const formatDate = (date, options) => {
    if (!date) return '';
    
    if (options) {
        return new Date(date).toLocaleDateString('es-ES', options);
    }

    // Formato YYYY-MM-DD
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};