import React, { useState } from 'react';
import ReviewDetailModal from './ReviewDetailModal';

export default function ReviewCard({ review, onEdit, onDelete }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Usar el total_rating de la base de datos o calcularlo si no existe
    const globalRating = review.total_rating || (() => {
        const ratings = [
            review.connectivity_rating,
            review.cost_of_living_rating,
            review.housing_rating,
            review.social_life_rating,
            review.academic_experience_rating
        ].filter(rating => rating !== null && rating !== undefined);
        
        if (ratings.length === 0) return null;
        return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    })();

    // Mostrar "Anónimo" si el review es anónimo
    const displayName = review.anonymous ? "Anónimo" : (review.profiles?.username ?? "Usuario");

    return (
        <div className="w-full max-w-xl bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
            {/* Header con información básica */}
            <div className="mb-3">
                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-500">
                        {displayName} | {review.semester}
                    </span>
                    {globalRating && (
                        <span className="text-yellow-500 text-lg font-semibold">
                            ★ {globalRating.toFixed(1)}
                        </span>
                    )}
                </div>
                
                {/* Vista previa del comentario general */}
                <p className="text-gray-700 text-base">
                    {review.general_description?.length > 100 
                        ? `${review.general_description.substring(0, 100)}...` 
                        : review.general_description || "Sin comentario"
                    }
                </p>
            </div>

            {/* Botón para abrir modal */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="hover:cursor-pointer text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
                Ver review completo
            </button>

            {/* Modal con detalles completos */}
            <ReviewDetailModal 
                review={review}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
} 