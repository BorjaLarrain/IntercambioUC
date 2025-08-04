import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { UserAuth } from "../context/AuthContext";

export default function Home() {
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();

    console.log(session);

    return (
        <div>
            <h1>Página principal</h1>
            <h2>Bienvenido, {session?.user?.email}</h2>
            <div>
                <p>Cerrar sesión</p>
            </div>
        </div>
    )
}