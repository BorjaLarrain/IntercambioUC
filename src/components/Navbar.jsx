import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import CreateReviewInstructionsModal from "./CreateReviewInstructionsModal";

export default function Navbar({ menuOpen, setMenuOpen }) {
    const [showInstructions, setShowInstructions] = useState(false);

    // Cada vez que cambie el valor de "menuOpen", cambia el overflow del body a "hidden" si está abierto o restauralo si está cerrado.
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
    }, [menuOpen]);

    // Se importa el tema de las sesiones
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();

    // Función para cerrar sesión
    const handleSignOut = async (e) => {
        e.preventDefault();

        if (!session) return;

        try {
            await signOut();
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    const handleCreateReviewClick = (e) => {
        e.preventDefault();
        setShowInstructions(true);
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-40 bg-[rgba(10, 10, 10, 0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="font-mono text-xl font-bold text-black">Intercambio<span className="text-blue-500">UC</span></Link>

                        {/* MOBILE */}
                        <div className="w-7 h-5 relative cursor-pointer z-40 md:hidden" onClick={() => setMenuOpen((prev) => !prev)}>
                            &#9776;
                        </div>

                        {/* DESKTOP */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-black hover:text-blue-500 transition-colors">Inicio</Link>
                            <button 
                                onClick={handleCreateReviewClick}
                                className="text-black hover:text-blue-500 transition-colors cursor-pointer"
                            >
                                Crear reseña
                            </button>
                            {session ? (
                                <>
                                    <Link
                                        to="/miperfil"
                                        className="text-black hover:text-blue-500 transition-colors cursor-pointer"
                                    >
                                        Mi perfil
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-black hover:text-blue-500 transition-colors cursor-pointer"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signup"
                                        className="text-black hover:text-blue-500 transition-colors cursor-pointer"
                                    >
                                        Crear cuenta
                                    </Link>

                                    <Link
                                        to="/signin"
                                        className="text-black hover:text-blue-500 transition-colors cursor-pointer"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modal de instrucciones */}
            <CreateReviewInstructionsModal 
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
            />
        </>
    );
}