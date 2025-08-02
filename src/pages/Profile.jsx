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
                .select("username, phone_number")
                .eq("id", session.user.id)
                .single();

            if (error) {
                setError("No se pudo cargar el perfil");
                console.log(error.message)
            } else {
                setUsername(data?.username || "");
                setPhone(data?.phone_number || "");
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
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-colors"
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