import React from "react";

export default function UniversityFilters({ filters, setFilters, onClearFilters }) {
    // Opciones para los filtros
    const continents = ["Europa", "América del Norte", "América del Sur", "Asia", "África", "Oceanía"];
    const countries = ["Estados Unidos", "Reino Unido", "Canadá", "Australia", "Alemania", "Francia", "España", "Italia", "Países Bajos", "Suecia", "Noruega", "Dinamarca", "Suiza", "Austria", "Bélgica", "Irlanda", "Nueva Zelanda", "Singapur", "Hong Kong", "Japón", "Corea del Sur"];
    const ratingRanges = [
        { label: "Cualquier rating", value: "" },
        { label: "4.5 o más", value: "4.5" },
        { label: "4.0 o más", value: "4.0" },
        { label: "3.5 o más", value: "3.5" },
        { label: "3.0 o más", value: "3.0" }
    ];

    return (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>
            
            <div className="block">
                {/* Filtros principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Filtro por continente */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Continente
                        </label>
                        <select
                            value={filters.continent}
                            onChange={(e) => setFilters({...filters, continent: e.target.value})}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            <option value="">Todos los continentes</option>
                            {continents.map((continent) => (
                                <option key={continent} value={continent}>
                                    {continent}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por país */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            País
                        </label>
                        <select
                            value={filters.country}
                            onChange={(e) => setFilters({...filters, country: e.target.value})}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            <option value="">Todos los países</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating mínimo
                        </label>
                        <select
                            value={filters.rating}
                            onChange={(e) => setFilters({...filters, rating: e.target.value})}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        >
                            {ratingRanges.map((range) => (
                                <option key={range.value} value={range.value}>
                                    {range.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filtros activos */}
                {Object.values(filters).some(value => value && value !== "") && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Filtros activos:</h3>
                        <div className="flex flex-wrap gap-2">
                            {filters.continent && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Continente: {filters.continent}
                                </span>
                            )}

                            {filters.country && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    País: {filters.country}
                                </span>
                            )}
                            
                            {filters.rating && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Rating: {filters.rating}+
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 