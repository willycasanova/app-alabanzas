import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importamos el CSS base
import { ClipboardList, Music } from 'lucide-react';

// Estilos de Tailwind CSS para sobrescribir los estilos base de react-calendar
const calendarStyles = `
/* Contenedor principal */
.react-calendar {
  width: 100%;
  max-width: 100%;
  background: white;
  border: 1px solid #e2e8f0; /* border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  font-family: 'Inter', sans-serif;
  line-height: 1.125em;
  padding: 1rem;
}

/* Navegación del calendario (mes y año) */
.react-calendar__navigation {
  display: flex;
  margin-bottom: 1rem;
  height: 44px;
}
.react-calendar__navigation button {
  min-width: 44px;
  background: none;
  font-size: 1rem;
  font-weight: 600;
  color: #4338ca; /* indigo-700 */
  transition: background-color 0.2s;
  border-radius: 0.375rem; /* rounded-md */
}
.react-calendar__navigation button:enabled:hover,
.react-calendar__navigation button:enabled:focus {
  background-color: #eef2ff; /* indigo-50 */
}

/* Días de la semana (encabezado) */
.react-calendar__month-view__weekdays {
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75rem; /* text-xs */
  color: #64748b; /* slate-500 */
  margin-bottom: 0.5rem;
}

/* Contenido de los días */
.react-calendar__tile {
  max-width: 100%;
  padding: 10px 6.6667px;
  background: none;
  text-align: center;
  line-height: 16px;
  height: 120px; /* Altura para mostrar contenido adicional */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  transition: background-color 0.2s, box-shadow 0.2s;
  border-radius: 0.375rem; /* rounded-md */
  cursor: pointer;
}

.react-calendar__month-view__days__day {
  margin: 2px;
}

/* Número del día */
.react-calendar__tile__abbr {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b; /* slate-800 */
}

/* Días fuera del mes visible */
.react-calendar__month-view__days__day--neighboringMonth {
  color: #94a3b8; /* slate-400 */
  opacity: 0.6;
}

/* Día actual */
.react-calendar__tile--now {
  background: #c7d2fe; /* indigo-300 */
  color: #1e293b;
  font-weight: bold;
}

/* Día seleccionado */
.react-calendar__tile--active:enabled:hover,
.react-calendar__tile--active:enabled:focus,
.react-calendar__tile--active {
  background: #4338ca !important; /* indigo-700 */
  color: white !important;
}
.react-calendar__tile--active .react-calendar__tile__abbr {
    color: white !important;
}
.react-calendar__tile--now:enabled:hover,
.react-calendar__tile--now:enabled:focus {
  background: #a5b4fc; /* indigo-400 */
}

/* Puntos de contenido (los iconos que agregamos) */
.content-dot {
    position: absolute;
    bottom: 5px;
    right: 5px;
    display: flex;
    gap: 2px;
}
.note-icon {
    color: #059669; /* emerald-600 */
}
.song-icon {
    color: #f59e0b; /* amber-500 */
}

/* Estilo para pantallas pequeñas */
@media (max-width: 640px) {
  .react-calendar__month-view__weekdays__weekday {
    font-size: 0.65rem;
  }
  .react-calendar__tile {
      height: 90px;
      padding: 5px 2px;
  }
  .react-calendar__tile__abbr {
      font-size: 0.8rem;
  }
  .content-dot {
      bottom: 2px;
      right: 2px;
  }
}
`;

const CalendarView = ({ assignedSongs, dailyNotes, handleDayClick }) => {
    const [calendarDate, setCalendarDate] = useState(new Date());

    // Función para renderizar el contenido dentro de cada celda del día
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const hasNote = !!dailyNotes[dateString];
            const hasAssignment = date.getDay() === 0 && (assignedSongs[dateString]?.length > 0);

            if (hasNote || hasAssignment) {
                return (
                    <div className="content-dot mt-5 sm:mt-8">
                        {hasNote && <ClipboardList size={18} className="note-icon" title="Hay una nota diaria" />}
                        {hasAssignment && <Music size={18} className="song-icon" title="Canciones asignadas para el domingo" />}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Calendario de Notas y Asignaciones</h2>
            
            {/* Contenedor de estilos para react-calendar */}
            <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />

            <div className="overflow-x-auto">
                <Calendar
                    onChange={setCalendarDate}
                    value={calendarDate}
                    onClickDay={handleDayClick} // Usa la función pasada desde App.jsx
                    locale="es-ES" // Establece el idioma del calendario
                    tileContent={tileContent}
                    className="mx-auto" // Centrar el calendario
                />
            </div>

            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Leyenda:</p>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <ClipboardList size={20} className="text-emerald-600 mr-2" />
                        <span className="text-gray-700">Nota diaria guardada</span>
                    </div>
                    <div className="flex items-center">
                        <Music size={20} className="text-amber-500 mr-2" />
                        <span className="text-gray-700">Canciones asignadas (Domingo)</span>
                    </div>
                </div>
                <p className="mt-3 text-sm text-indigo-600">
                    Haz click en cualquier día para ver/añadir notas o asignar canciones si es domingo.
                </p>
            </div>
        </div>
    );
};

export default CalendarView;
