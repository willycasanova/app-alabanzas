import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import Message from "@/components/Message.jsx";
import logo from "@/assets/logo192.png";

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

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const { login, resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim() || !password.trim()) {
      setMessage({ text: "Por favor, completa todos los campos.", type: "error" });
      return;
    }
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setMessage({
          text: "Credenciales incorrectas. Por favor, verifica tu email y contraseña.",
          type: "error",
        });
      } else {
        setMessage({ text: "Ocurrió un error al iniciar sesión.", type: "error" });
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setMessage({
        text: "Por favor, ingresa tu email para recuperar la contraseña.",
        type: "error",
      });
      return;
    }
    setMessage(null);
    try {
      await resetPassword(email);
      setMessage({
        text: "Si el email está registrado, recibirás un correo para restablecer tu contraseña.",
        type: "success",
      });
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      setMessage({
        text: "Error al enviar el correo de recuperación. Por favor, verifica el email.",
        type: "error",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo de la aplicación" className="login-logo" />
        <h2 className="login-title">Inicia Sesión</h2>
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
            <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
            </button>
          </div>
          <button type="submit" className="login-button primary" disabled={loading}>
            {loading ? "Iniciando..." : "Entrar"}
          </button>
        </form>
        <div className="mt-4 space-y-4">
          <p className="forgot-password-text">
            <button onClick={handlePasswordReset} className="forgot-password-link" disabled={loading}>
              ¿Olvidaste tu contraseña?
            </button>
          </p>
          <p className="register-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="register-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;