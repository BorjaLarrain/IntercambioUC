// IMPORTS
import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import UniversityCard from "../components/UniversityCard";
import UniversityFilters from "../components/UniversityFilters";
import UniversityStats from "../components/UniversityStats";
import AdvancedSearch from "../components/AdvancedSearch";

// IMPORTS (no usados en otros componentes)
import { useLocation } from "react-router-dom";

// Función auxiliar
// Comentarios: si la url es "/resultados?query=manchester", luego "useQuery.get("query")" retorna "manchester"
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Universities() {
    const navigate = useNavigate();
    
    // Se obtiene el valor del string buscado
    const query = useQuery().get("query") || "";

    // Se definen los estados
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(query);
    const [filters, setFilters] = useState({
        continent: "",
        rating: "",
        location: ""
    });

    // Estados para paginación
    const [displayedResults, setDisplayedResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(6);
    const [loadingMore, setLoadingMore] = useState(false);

    // useEffect para la búsqueda de los resultados
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setCurrentPage(1); // Resetear a la primera página
            
            let queryBuilder = supabase
                .from("universities")
                .select("*");

            // Aplicar filtro de búsqueda por nombre
            if (searchTerm) {
                queryBuilder = queryBuilder.ilike("name", `%${searchTerm}%`);
            }

            // Aplicar filtros adicionales
            if (filters.continent) {
                queryBuilder = queryBuilder.eq("continent", filters.continent);
            }

            if (filters.location) {
                queryBuilder = queryBuilder.eq("location", filters.location);
            }

            if (filters.rating) {
                queryBuilder = queryBuilder.gte("global_rating", parseFloat(filters.rating));
            }

            const { data, error } = await queryBuilder;

            if (error) {
                console.log("Ocurrió un error:", error);
                setResults([]);
                setDisplayedResults([]);
            } else {
                setResults(data || []);
                setDisplayedResults((data || []).slice(0, resultsPerPage));
                console.log("Resultados encontrados:", data);
            }
            
            setLoading(false);
        };

        fetchResults();
    }, [searchTerm, filters, resultsPerPage]);

    // Función para cargar más resultados
    const loadMoreResults = () => {
        setLoadingMore(true);
        
        // Simular un pequeño delay para mejor UX
        setTimeout(() => {
            const nextPage = currentPage + 1;
            const startIndex = 0;
            const endIndex = nextPage * resultsPerPage;
            
            setDisplayedResults(results.slice(startIndex, endIndex));
            setCurrentPage(nextPage);
            setLoadingMore(false);
        }, 300);
    };

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para limpiar filtros
    const clearFilters = () => {
        setFilters({
            continent: "",
            rating: "",
            location: ""
        });
        setSearchTerm("");
    };

    // Función para ordenar resultados
    const sortResults = (sortBy) => {
        const sortedResults = [...results].sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return (b.global_rating || 0) - (a.global_rating || 0);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'location':
                    return a.location.localeCompare(b.location);
                default:
                    return 0;
            }
        });
        setResults(sortedResults);
        setDisplayedResults(sortedResults.slice(0, resultsPerPage));
        setCurrentPage(1);
    };

    // Calcular si hay más resultados para mostrar
    const hasMoreResults = displayedResults.length < results.length;
    const totalPages = Math.ceil(results.length / resultsPerPage);

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Universidades</h1>
                    <p className="text-gray-600">Encuentra la universidad perfecta para tu intercambio académico!</p>
                </div>

                {/* Search Bar */}
                <AdvancedSearch 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                {/* Filtros */}
                <UniversityFilters 
                    filters={filters}
                    setFilters={setFilters}
                    onClearFilters={clearFilters}
                />

                {/* Estadísticas */}
                {results.length > 0 && !loading && (
                    <UniversityStats results={results} filters={filters} />
                )}

                {/* Resultados */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {loading ? "Buscando..." : `${results.length} universidades encontradas`}
                        </h2>
                        
                        {results.length > 0 && (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Ordenar por:</span>
                                <select
                                    onChange={(e) => sortResults(e.target.value)}
                                    className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="rating">Rating</option>
                                    <option value="name">Nombre</option>
                                    <option value="location">País</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-600 text-lg mb-2">No se encontraron universidades</div>
                            <p className="text-gray-500 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
                            <button
                                onClick={clearFilters}
                                className="hover:cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayedResults.map((university) => (
                                    <UniversityCard key={university.id} university={university} />
                                ))}
                            </div>

                            {/* Información de paginación */}
                            {results.length > resultsPerPage && (
                                <div className="mt-6 text-center text-sm text-gray-600">
                                    Mostrando {displayedResults.length} de {results.length} universidades
                                    {totalPages > 1 && (
                                        <div className="ml-2">(Página {currentPage} de {totalPages})</div>
                                    )}
                                </div>
                            )}

                            {/* Botón "Cargar más" */}
                            {hasMoreResults && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={loadMoreResults}
                                        disabled={loadingMore}
                                        className="hover:cursor-pointer bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors flex items-center justify-center mx-auto space-x-2"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Cargando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                                <span>Mostrar más universidades</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}