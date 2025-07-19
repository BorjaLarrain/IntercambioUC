import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Manejo de sesiones
import { UserAuth } from "../context/AuthContext";

export default function SignIn() {
    // Estados
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const { signIn, signInGoogle } = UserAuth();
    const navigate = useNavigate();

    // Función para manejo de inicio de sesión con email y contraseña
    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Se obtiene el resultado de la función
        const result = await signIn(email, password);

        // Se revisa si hay un error
        if (result.error) {
            if (result.error.message.includes("Invalid login credentials")) {
                setError("Las credenciales no son correctas.");
            } else {
                setError("Ocurrió un error. Intenta nuevamente por favor.")
            }
        } else {
            navigate('/');
            setError("");
        }

        setLoading(false);
    };

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
            <form onSubmit={handleSignIn} className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-blue-500 mb-2 text-center">Iniciar sesión</h2>
                <p className="text-center text-gray-600 mb-6">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline font-semibold">Regístrate!</Link>
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
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="hover:cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-colors"
                    disabled={loading}
                    onClick={handleSignIn}
                >
                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>

                <button
                    type="button"
                    className="mt-2 hover:cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-colors"
                    onClick={handleSignInGoogle}
                    disabled={loading}
                >
                    Iniciar sesión con Google
                </button>

                {error && <div className="text-red-600 font-semibold w-full mt-5 text-center">{error}</div>}
            </form>
        </div>
    );
}