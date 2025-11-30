import React, { useState, useCallback } from 'react';

const Calendar = ({ dailyNotes, assignedSongs, handleDayClick, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendarDays = useCallback(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-pre-${i}`} className="calendar-day empty"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
            const dateString = date.toISOString().split('T')[0];
            const hasNote = !!dailyNotes[dateString];
            const hasAssignment = assignedSongs && Array.isArray(assignedSongs[dateString]) && assignedSongs[dateString].length > 0;
            const isSunday = date.getDay() === 0;

            days.push(
                <button
                    key={i}
                    className={`calendar-day ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${isSunday ? 'font-bold text-red-600' : 'text-gray-700'}`}
                    onClick={() => handleDayClick(date)}
                    aria-label={`Día ${i}`}
                >
                    <span className="calendar-day-number">{i}</span>
                    {(hasNote || hasAssignment) && (
                        <div className="absolute bottom-1.5 flex space-x-1">
                            {hasNote && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" title="Tiene nota"></div>}
                            {hasAssignment && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" title="Tiene asignación"></div>}
                        </div>
                    )}
                </button>
            );
        }
        
        const remaining = (7 - (days.length % 7)) % 7;
        for (let i = 0; i < remaining; i++) {
            days.push(<div key={`empty-post-${i}`} className="calendar-day empty"></div>);
        }

        return days;
    }, [currentDate, selectedDate, dailyNotes, assignedSongs, handleDayClick]);

    const goToPreviousMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    return (
        <section className="calendar-container">
            <div className="calendar-header">
                <button onClick={goToPreviousMonth} className="calendar-nav-button" aria-label="Mes anterior">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h2 className="calendar-title capitalize">{currentDate.toLocaleString("es-ES", { month: "long", year: "numeric" })}</h2>
                <button onClick={goToNextMonth} className="calendar-nav-button" aria-label="Mes siguiente">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
            <div className="calendar-grid">
                <div className="calendar-day-name">D</div><div className="calendar-day-name">L</div><div className="calendar-day-name">M</div><div className="calendar-day-name">X</div><div className="calendar-day-name">J</div><div className="calendar-day-name">V</div><div className="calendar-day-name">S</div>
            </div>
            <div className="calendar-grid">{renderCalendarDays()}</div>
            <div className="flex justify-center items-center mt-4">
                <button onClick={goToToday} className="bg-indigo-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-indigo-600 transition">Hoy</button>
            </div>
        </section>
    );
};

export default Calendar;