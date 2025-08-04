import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Contenido principal del footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-1 justify-items-center">

                    {/* Sección: Acerca del proyecto */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Intercambio<span className="text-blue-500">UC</span></h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Plataforma independiente que conecta estudiantes UC con experiencias de intercambio
                            académico a través de reseñas, comentarios y calificaciones reales por categorías.
                        </p>
                        <div className="text-xs text-gray-500 bg-blue-100 px-3 py-2 rounded-lg">
                            <p className="font-semibold">Proyecto independiente no oficial</p>
                            <p>No afiliado a la Pontificia Universidad Católica de Chile</p>
                        </div>
                    </div>

                    {/* Sección: Recursos útiles */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plataforma</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Inicio</a>
                            </li>
                            <li>
                                <a href="/miperfil" className="text-gray-600 hover:text-blue-600 transition-colors">Mi perfil</a>
                            </li>
                            <li>
                                <a href="/universidades" className="text-gray-600 hover:text-blue-600 transition-colors">Explorar universidades</a>
                            </li>
                        </ul>
                    </div>

                    {/* Sección: Fundadores */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fundadores</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-gray-600">B</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Borja Larraín</p>
                                    <a
                                        href="https://github.com/BorjaLarrain"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-gray-600">S</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Sebastián Passi</p>
                                    <a
                                        href="https://github.com/SebaPassi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
