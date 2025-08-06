import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Manejo de sesiones
import { UserAuth } from "../context/AuthContext";

export default function SignUp() {
    // Estados
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const [usernameError, setUsernameError] = useState("");

    const { session, signUpNewUser, signInGoogle } = UserAuth();
    const navigate = useNavigate();

    // Función para validar username
    const validateUsername = (value) => {
        if (!value.trim()) {
            setUsernameError("El nombre de usuario es obligatorio");
            return false;
        }
        setUsernameError("");
        return true;
    };

    // Función para manejo de crear cuenta
    const handleSignUp = async (e) => {
        e.preventDefault();
        
        // Validar username antes de continuar
        if (!validateUsername(username)) {
            return;
        }
        
        setLoading(true);

        // Se obtiene el resultado de la función
        const result = await signUpNewUser(email, password, username);

        // Se revisa si hay un error
        if (!result.success) {
            if (result.error.message.includes("User already registered")) {
                setError("El email indicado ya está registrado.");
            } else {
                setError("Ocurrió un error. Intenta nuevamente por favor.")
            }
            setLoading(false);
        } else {
            navigate('/');
            setError("");
            setLoading(false);
        }
    }

    // Función para manejo de inicio de sesión con Google
    const handleSignInGoogle = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signInGoogle();

            if (result.success) {
                navigate('/');
            }
        } catch (err) {
            setError("ocurrió un error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4">
            <form onSubmit={handleSignUp} className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-blue-500 mb-2 text-center">Crear cuenta</h2>
                <p className="text-center text-gray-600 mb-6">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/signin" className="text-blue-500 hover:underline font-semibold">Inicia sesión!</Link>
                </p>

                <div className="space-y-4 mb-6">
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Contraseña"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Nombre de usuario"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 ${
                                usernameError 
                                    ? 'border-red-500 focus:ring-red-400' 
                                    : 'border-gray-300 focus:ring-blue-400'
                            }`}
                            autoComplete="username"
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (usernameError) validateUsername(e.target.value);
                            }}
                            onBlur={(e) => validateUsername(e.target.value)}
                        />
                        {usernameError && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {usernameError}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="hover:cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-colors"
                >
                    Crear cuenta
                </button>

                <button
                    type="button"
                    className="mt-2 hover:cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-colors"
                    onClick={handleSignInGoogle}
                    disabled={loading}
                >
                    Crear cuenta con Google
                </button>

                {error && loading && <div className="text-red-600 font-semibold w-full mt-5 text-center">{error}</div>}
            </form>
        </div>
    )
}