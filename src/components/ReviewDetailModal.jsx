import React from 'react';
import { createPortal } from 'react-dom';

export default function ReviewDetailModal({ review, isOpen, onClose }) {
    if (!isOpen || !review) return null;

    // Calcular rating global si no existe
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

    const modalContent = (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '1rem'
            }}
        >
            <div 
                style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    width: '100%',
                    maxWidth: '72rem',
                    height: '95vh',
                    overflowY: 'auto',
                    position: 'relative'
                }}
            >
                {/* Header */}
                <div 
                    style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'white',
                        borderBottom: '1px solid #e5e7eb',
                        padding: '2rem',
                        borderRadius: '1rem 1rem 0 0',
                        zIndex: 10
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                                Review de {review.profiles?.username ?? "Anónimo"}
                            </h2>
                            <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontSize: '1.125rem' }}>
                                Semestre: {review.semester}
                            </p>
                            {globalRating && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#f59e0b', fontSize: '1.875rem', fontWeight: 'bold', marginRight: '0.75rem' }}>
                                        ★ {globalRating.toFixed(1)}
                                    </span>
                                    <span style={{ color: '#6b7280', fontSize: '1.125rem' }}>Rating Global</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                color: '#6b7280',
                                fontSize: '1.875rem',
                                fontWeight: 'bold',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'none'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#374151'}
                            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Descripción General */}
                    <div style={{ backgroundColor: '#eff6ff', borderRadius: '0.75rem', padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e40af', marginBottom: '1rem' }}>
                            📝 Descripción General
                        </h3>
                        <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1.125rem' }}>
                            {review.general_description || "Sin descripción general disponible."}
                        </p>
                    </div>

                    {/* Ratings por Categoría */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                        gap: '2rem' 
                    }}>
                        {review.connectivity_rating && (
                            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                                        🚇 Movilidad
                                    </h4>
                                    <span style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        ★ {review.connectivity_rating}
                                    </span>
                                </div>
                                {review.connectivity_description && (
                                    <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1rem' }}>
                                        {review.connectivity_description}
                                    </p>
                                )}
                            </div>
                        )}

                        {review.housing_rating && (
                            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                                        🏠 Alojamiento
                                    </h4>
                                    <span style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        ★ {review.housing_rating}
                                    </span>
                                </div>
                                {review.housing_description && (
                                    <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1rem' }}>
                                        {review.housing_description}
                                    </p>
                                )}
                            </div>
                        )}

                        {review.cost_of_living_rating && (
                            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                                        💰 Costo de Vida
                                    </h4>
                                    <span style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        ★ {review.cost_of_living_rating}
                                    </span>
                                </div>
                                {review.cost_of_living_description && (
                                    <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1rem' }}>
                                        {review.cost_of_living_description}
                                    </p>
                                )}
                            </div>
                        )}

                        {review.social_life_rating && (
                            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                                        🎉 🎭 Vida Social y Cultural
                                    </h4>
                                    <span style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        ★ {review.social_life_rating}
                                    </span>
                                </div>
                                {review.social_life_description && (
                                    <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1rem' }}>
                                        {review.social_life_description}
                                    </p>
                                )}
                            </div>
                        )}

                        {review.academic_experience_rating && (
                            <div style={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '0.75rem', 
                                padding: '2rem', 
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                gridColumn: '1 / -1'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2563eb', display: 'flex', alignItems: 'center' }}>
                                        📚 Experiencia Académica
                                    </h4>
                                    <span style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        ★ {review.academic_experience_rating}
                                    </span>
                                </div>
                                {review.academic_experience_description && (
                                    <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1rem' }}>
                                        {review.academic_experience_description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: 'white',
                    borderTop: '1px solid #e5e7eb',
                    padding: '2rem',
                    borderRadius: '0 0 1rem 1rem'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );

    // Renderizar el modal fuera del contenedor padre usando Portal
    return createPortal(modalContent, document.body);
}