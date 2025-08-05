import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateReviewInstructionsModal from "./CreateReviewInstructionsModal";
import { UserAuth } from "../context/AuthContext";

export default function MobileMenu({ menuOpen, setMenuOpen }) {
    const [showInstructions, setShowInstructions] = useState(false);

    const handleCreateReviewClick = (e) => {
        e.preventDefault();
        setShowInstructions(true);
        setMenuOpen(false);
    };

    // Se importa el tema de las sesiones
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();

    // Función para cerrar sesión
    const handleSignOut = async (e) => {
        e.preventDefault();

        if (!session) return;

        try {
            await signOut();
            setMenuOpen(false);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className={`fixed top-0 left-0 w-full bg-[rgba(178,178,178,0.8)] z-40 flex flex-col items-center justify-center transition-all durantion-300 ease-in-out ${menuOpen ? "h-screen opacity-100 pointer-events-auto" : "h-0 opacity-0 pointer-events-none"}`}>
                <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 text-white text-3xl focus:outline-none cursor-pointer" aria-label="Close Menu">
                    &times;
                </button>

                {/* Botón "Inicio" */}
                <Link to="/" onClick={() => setMenuOpen(false)} className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>Inicio</Link>

                {/* Botón "Crear reseña" */}
                <button
                    onClick={handleCreateReviewClick}
                    className={`hover:cursor-pointer text-2xl font-semibold text-white my-4 transform transition-transform duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                >
                    Crear reseña
                </button>

                {session ? (
                    <>
                        <Link
                            to="/miperfil"
                            onClick={() => setMenuOpen(false)}
                            className={`hover:cursor-pointer text-2xl font-semibold text-white my-4 transform transition-transform duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                        >
                            Mi perfil
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className={`hover:cursor-pointer text-2xl font-semibold text-white my-4 transform transition-transform duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/signup"
                            onClick={() => setMenuOpen(false)}
                            className={`hover:cursor-pointer text-2xl font-semibold text-white my-4 transform transition-transform duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                        >
                            Crear cuenta
                        </Link>

                        <Link
                            to="/signin"
                            onClick={() => setMenuOpen(false)}
                            className={`hover:cursor-pointer text-2xl font-semibold text-white my-4 transform transition-transform duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                        >
                            Iniciar sesión
                        </Link>
                    </>
                )}
            </div>

            {/* Modal de instrucciones */}
            <CreateReviewInstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
            />
        </>
    );
}