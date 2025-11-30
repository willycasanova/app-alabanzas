import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import Message from '@/components/Message.jsx';
import logo from '@/assets/logo192.png';

const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#252525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#252525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState(null);
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        if (password !== confirmPassword) {
            setMessage({ text: "Las contraseñas no coinciden.", type: "error" });
            return;
        }
        try {
            await register(email, password);
            navigate("/");
        } catch (error) {
            console.error("Error al registrar:", error);
            if (error.code === "auth/email-already-in-use") {
                setMessage({
                    text: "El correo electrónico ya está en uso. Por favor, inicia sesión o usa otro.",
                    type: "error",
                });
            } else if (error.code === "auth/weak-password") {
                setMessage({
                    text: "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.",
                    type: "error",
                });
            } else {
                setMessage({ text: "Ocurrió un error durante el registro.", type: "error" });
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logo} alt="Logo de la aplicación" className="login-logo" />
                <h2 className="login-title">Crea una Cuenta</h2>
                {message && (
                    <div className="mb-4">
                        <Message message={message.text} type={message.type} />
                    </div>
                )}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="login-input" placeholder="tu.email@ejemplo.com" required />
                    </div>
                    <div className="input-group relative">
                        <label htmlFor="password">Contraseña</label>
                        <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" placeholder="Mínimo 6 caracteres" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                            {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                        </button>
                    </div>
                    <div className="input-group relative">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input id="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="login-input" placeholder="Repite la contraseña" required />
                    </div>
                    <button type="submit" className="login-button primary" disabled={loading}>
                        {loading ? "Registrando..." : "Crear Cuenta"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="register-text">
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login" className="register-link">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;