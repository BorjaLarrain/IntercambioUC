import React from "react";

export default function Footer() {
    return (
        <footer className="w-full bg-blue-50 border-t border-blue-100 py-4 mt-2 text-center text-gray-500 text-sm">
            IntercambioUC &copy; {new Date().getFullYear()} &middot; Página externa y no oficial
            <span className="mx-2">|</span>
            <a href="mailto:contacto@intercambiouc.cl" className="text-blue-500 hover:underline">Contacto</a>
        </footer>
    );
}
