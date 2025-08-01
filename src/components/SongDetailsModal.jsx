import React from 'react';
import Modal from './Modal';

const SongDetailsModal = ({ show, onClose, song }) => {
    if (!song) return null;

    return (
        <Modal show={show} onClose={onClose} title={song.name} widthClass="max-w-lg">
            <div className="space-y-4 text-gray-800">
                <p><strong className="font-semibold">Tonalidad:</strong> {song.key}</p>
                {song.sheetMusicLink && (
                    <p>
                        <strong className="font-semibold">Partitura/Letra:</strong>{' '}
                        <a
                            href={song.sheetMusicLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline break-all"
                        >
                            Ver Partitura
                        </a>
                    </p>
                )}
                {song.videoLink && (
                    <p>
                        <strong className="font-semibold">Video:</strong>{' '}
                        <a
                            href={song.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline break-all"
                        >
                            Ver Video
                        </a>
                    </p>
                )}
                {/* Add more details here if available in your song object */}
            </div>
        </Modal>
    );
};

export default SongDetailsModal;