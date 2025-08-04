import React from "react";
import { useNavigate } from "react-router-dom";

export default function UniversityCard({ university }) {
    const navigate = useNavigate();

    // Función para formatear el rating
    const formatRating = (rating) => {
        return rating ? parseFloat(rating).toFixed(1) : "N/A";
    };

    // Función para obtener el color del rating
    const getRatingColor = (rating) => {
        if (!rating) return "text-gray-400";
        const numRating = parseFloat(rating);
        if (numRating >= 4.5) return "text-green-600";
        if (numRating >= 4.0) return "text-blue-600";
        if (numRating >= 3.5) return "text-yellow-600";
        if (numRating >= 3.0) return "text-orange-600";
        return "text-red-600";
    };

    return (
        <div
            className="bg-white rounded-lg p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-blue-500/10 group flex flex-col h-full"
            onClick={() => navigate(`/universidad/${university.id}`)}
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {university.name}
                </h3>
                <div className="flex items-center space-x-1 ml-2">
                    <span className="text-yellow-400">★</span>
                    <span className={`font-medium ${getRatingColor(university.global_rating)}`}>
                        {formatRating(university.global_rating)}
                    </span>
                </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 flex-grow">
                <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {university.location}
                </div>
                
                {university.continent && (
                    <div className="flex items-center mb-4">
                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {university.continent}
                    </div>
                )}
            </div>
            
            <div className="pt-4 border-t border-gray-200 mt-auto">
                <button className="hover:cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors group-hover:bg-blue-500">
                    Ver detalles
                </button>
            </div>
        </div>
    );
} 