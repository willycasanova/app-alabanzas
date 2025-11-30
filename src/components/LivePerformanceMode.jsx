import React, { useState } from 'react';

const LivePerformanceMode = ({ setlist, exitLivePerformance }) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    const handleNext = () => {
        setCurrentSongIndex(prev => (prev + 1) % setlist.length);
    };

    const handlePrevious = () => {
        setCurrentSongIndex(prev => (prev - 1 + setlist.length) % setlist.length);
    };

    const currentSong = setlist[currentSongIndex];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 font-inter flex flex-col items-center justify-center">
            <header className="absolute top-4 right-4">
                <button
                    onClick={exitLivePerformance}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 font-semibold"
                >
                    Salir del Modo Presentación
                </button>
            </header>
            {setlist.length > 0 ? (
                <div className="w-full max-w-4xl text-center">
                    <h2 className="text-xl text-gray-400 font-medium">Ahora sonando:</h2>
                    <h1 className="text-4xl sm:text-6xl font-bold mt-2 mb-4 text-indigo-400">{currentSong.name}</h1>
                    <p className="text-2xl sm:text-3xl font-light text-gray-300">Clave: {currentSong.key}</p>

                    <div className="mt-8 flex justify-center space-x-4">
                        <a href={currentSong.sheetMusicLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 transition duration-200 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Partitura
                        </a>
                        <a href={currentSong.videoLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 transition duration-200 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.196l-3.328-1.748A1 1 0 0010 10.364V13.636a1 1 0 001.424.892l3.328-1.748a1 1 0 000-1.784z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Video
                        </a>
                    </div>

                    <div className="mt-12 flex justify-center items-center space-x-6">
                        <button
                            onClick={handlePrevious}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <span className="text-xl font-medium">{currentSongIndex + 1} de {setlist.length}</span>
                        <button
                            onClick={handleNext}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-400">No hay canciones en la lista. Por favor, selecciona algunas para el domingo.</p>
                    <button
                        onClick={exitLivePerformance}
                        className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 font-semibold"
                    >
                        Volver
                    </button>
                </div>
            )}
        </div>
    );
};

export default LivePerformanceMode;