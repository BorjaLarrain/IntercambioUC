import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { UserAuth } from "../context/AuthContext";

export default function Profile() {
    const { session } = UserAuth();
    const navigate = useNavigate();

    // Estados para los campos del perfil
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [shareEmail, setShareEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Cargar datos actuales del perfil
    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from("profiles")
                .select("username, phone_number, share_email")
                .eq("id", session.user.id)
                .single();

            if (error) {
                setError("No se pudo cargar el perfil");
                console.log(error.message)
            } else {
                setUsername(data?.username || "");
                setPhone(data?.phone_number || "");
                setShareEmail(data?.share_email || false);
                console.log(username)
                console.log(phone)
            }
            setLoading(false);
        };

        fetchProfile();
    }, [session]);

    // Función para guardar los cambios
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Si no hay sesión
        if (!session?.user) return;

        // Valores de variables a actualizar
        const updates = {
            id: session.user.id,
            username: username || null,
            phone_number: phone || null,
            share_email: shareEmail,
            updated_at: new Date(),
        };

        const { error } = await supabase.from("profiles").upsert(updates, { returning: "minimal" });

        if (error) {
            console.log(error.message)
            setError("No se pudo guardar el perfil");
        } else {
            setSuccess("Perfil actualizado!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-blue-500 text-center mb-3">Mi perfil</h2>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Nombre de usuario</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de usuario"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Teléfono</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Teléfono (opcional)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                            ¿Mostrar mi correo electrónico en las reseñas que he realizado para que puedan contactarme?
                        </label>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => setShareEmail(true)}
                                className={`hover:cursor-pointer flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all duration-200 ${
                                    shareEmail
                                        ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                                        : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                }`}
                            >
                                Sí
                            </button>
                            <button
                                type="button"
                                onClick={() => setShareEmail(false)}
                                className={`hover:cursor-pointer flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all duration-200 ${
                                    !shareEmail
                                        ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                                        : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                }`}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="hover:cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-colors"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Guardar cambios"}
                </button>
                {success && <div className="text-green-600 font-semibold w-full mt-5 text-center">{success}</div>}
                {error && <div className="text-red-600 font-semibold w-full mt-5 text-center">{error}</div>}
            </form>
        </div>
    );
}