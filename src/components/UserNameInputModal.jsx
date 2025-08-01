import React, { useState, useEffect, useCallback } from 'react';

// Modal.jsx (Componente genérico de Modal)
const Modal = ({ show, onClose, title, children, widthClass = 'max-w-lg' }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose} // Cierra el modal al hacer clic fuera del contenido
    >
      <div
        className={`bg-white rounded-lg shadow-xl p-6 relative ${widthClass} w-full`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre el modal
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-3xl leading-none"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// UserNameInputModal.jsx (Componente para introducir el nombre de usuario)
const UserNameInputModal = ({ show, onClose, inputUserName, setInputUserName, onSave }) => {
  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga de la página
    if (inputUserName.trim()) { // Asegura que el nombre no esté vacío
      await onSave(inputUserName); // ¡AHORA LLAMAMOS A 'onSave' PASANDO EL NOMBRE!
      onClose(); // Cierra el modal después de guardar
    }
  };

  return (
    <Modal show={show} onClose={onClose} title="¡Bienvenido/a!" widthClass="max-w-sm">
      {/* Envuelve tu contenido en una etiqueta <form> */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 text-center">
        <p className="text-lg text-gray-700">Por favor, introduce tu nombre para personalizar tu experiencia.</p>
        <div>
          <label htmlFor="userNameInput" className="sr-only">Tu Nombre:</label>
          <input
            type="text"
            id="userNameInput"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg"
            value={inputUserName}
            onChange={(e) => setInputUserName(e.target.value)}
            placeholder="Tu Nombre"
            required // Agrega 'required' para asegurar que el campo no esté vacío
          />
        </div>
        <button
          type="submit" // Cambia a type="submit" para que active el onSubmit del formulario
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Guardar Nombre
        </button>
      </form>
    </Modal>
  );
};

// App.jsx (Componente principal de la aplicación)
const App = () => {
  const [userName, setUserName] = useState(null); // Estado para el nombre de usuario
  const [inputUserName, setInputUserName] = useState(''); // Estado para el input del modal
  const [showUserNameModal, setShowUserNameModal] = useState(false); // Estado para controlar la visibilidad del modal

  // Efecto para cargar el nombre de usuario desde localStorage al inicio
  useEffect(() => {
    const storedUserName = localStorage.getItem('praiseAppUserName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setShowUserNameModal(true); // Mostrar el modal si no hay nombre guardado
    }
  }, []);

  // Función para guardar el nombre de usuario
  const handleSaveUserName = useCallback((name) => {
    localStorage.setItem('praiseAppUserName', name);
    setUserName(name);
    setInputUserName(name); // Asegura que el input se actualice con el nombre guardado
  }, []);

  // Función para abrir el modal de nombre de usuario
  const openUserNameModal = () => {
    setShowUserNameModal(true);
  };

  // Función para cerrar el modal de nombre de usuario
  const closeUserNameModal = () => {
    setShowUserNameModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center justify-center p-4 font-inter">
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Font Inter */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center space-y-6 transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          ¡Bienvenido/a a la App de Alabanzas!
        </h1>
        {userName ? (
          <p className="text-2xl text-gray-800">
            Hola, <span className="font-semibold text-purple-600">{userName}</span>. ¡Qué alegría tenerte aquí!
          </p>
        ) : (
          <p className="text-2xl text-gray-800">
            ¡Hola! Por favor, introduce tu nombre para empezar.
          </p>
        )}

        <button
          onClick={openUserNameModal}
          className="bg-purple-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          {userName ? 'Cambiar mi Nombre' : 'Introducir mi Nombre'}
        </button>

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">¡Alaba al Señor!</h2>
          <p className="text-lg text-gray-700">
            Aquí podrás encontrar inspiración y recursos para tus momentos de alabanza.
            Pronto añadiremos más funcionalidades.
          </p>
        </div>
      </div>

      {/* Modal para introducir el nombre de usuario */}
      <UserNameInputModal
        show={showUserNameModal}
        onClose={closeUserNameModal}
        inputUserName={inputUserName}
        setInputUserName={setInputUserName}
        onSave={handleSaveUserName} // Pasamos la función de guardado
      />
    </div>
  );
};

export default App;
