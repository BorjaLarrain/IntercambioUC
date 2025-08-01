import React from "react";

export default function UniversityStats({ results, filters }) {
    // Calcular estadísticas
    const stats = {
        total: results.length,
        averageRating: results.length > 0 
            ? (results.reduce((sum, uni) => sum + (uni.global_rating || 0), 0) / results.length).toFixed(1)
            : 0,
        topRated: results.filter(uni => uni.global_rating >= 4.5).length,
        countries: new Set(results.map(uni => uni.location)).size,
        continents: new Set(results.map(uni => uni.continent).filter(Boolean)).size
    };

    // Obtener países más comunes
    const countryCounts = results.reduce((acc, uni) => {
        acc[uni.location] = (acc[uni.location] || 0) + 1;
        return acc;
    }, {});

    const topCountries = Object.entries(countryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([country, count]) => ({ country, count }));

    return (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas de búsqueda</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">Universidades</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.averageRating}</div>
                    <div className="text-sm text-gray-600">Rating promedio</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.topRated}</div>
                    <div className="text-sm text-gray-600">Top rated (4.5+)</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.countries}</div>
                    <div className="text-sm text-gray-600">Países</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{stats.continents}</div>
                    <div className="text-sm text-gray-600">Continentes</div>
                </div>
            </div>

            {topCountries.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Países más representados:</h4>
                    <div className="flex flex-wrap gap-2">
                        {topCountries.map(({ country, count }) => (
                            <span 
                                key={country}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                {country} ({count})
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 