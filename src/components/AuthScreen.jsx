import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthScreen.css';

export default function AuthScreen() {
    const { login, register, loginAsGuest } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Formularios
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [aceptoTratamiento, setAceptoTratamiento] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                if (password !== confirmPassword) {
                    throw new Error("Las contraseñas no coinciden");
                }
                if (!aceptoTratamiento) {
                    throw new Error("Debes aceptar el tratamiento de datos personales");
                }
                await register({ nombre, email, password, acepto_tratamiento: aceptoTratamiento });
                setIsLoginView(true); // Cambiar a login después de registro exitoso
                setErrorMsg("Registro exitoso. Por favor, inicia sesión."); // Opcional, o loguearlo automáticamente
            }
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-screen">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>{isLoginView ? 'Iniciar Sesión' : 'Registro'}</h2>
                    <p>Bienvenido a nuestra tienda online</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                placeholder="Tu nombre"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Tu contraseña"
                        />
                    </div>
                    {!isLoginView && (
                        <>
                            <div className="form-group">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Repite tu contraseña"
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={aceptoTratamiento}
                                        onChange={(e) => setAceptoTratamiento(e.target.checked)}
                                    />
                                    Acepto el tratamiento de datos personales (Ley 25.326)
                                </label>
                            </div>
                        </>
                    )}
                    {errorMsg && <div className={`auth-error ${errorMsg.includes('exitoso') ? 'success' : ''}`}>{errorMsg}</div>}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || (!isLoginView && !aceptoTratamiento)}
                        title={
                            !isLoginView && !aceptoTratamiento
                                ? 'Debés aceptar el tratamiento de datos (Ley 25.326) para registrarte'
                                : undefined
                        }
                    >
                        {loading ? 'Cargando...' : (isLoginView ? 'Ingresar' : 'Crear Cuenta')}
                    </button>
                </form>

                <div className="auth-footer">
                    <button type="button" className="btn-link" onClick={() => {
                        setIsLoginView(!isLoginView);
                        setErrorMsg('');
                    }}>
                        {isLoginView ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                    
                    <div className="divider">o</div>
                    
                    <button type="button" className="btn-secondary" onClick={loginAsGuest}>
                        Continuar como invitado
                    </button>
                </div>
            </div>
        </div>
    );
}
