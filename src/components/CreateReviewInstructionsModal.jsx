import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

export default function CreateReviewInstructionsModal({ isOpen, onClose }) {
    // Se extrae sesión
    const { session } = UserAuth();

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        // Restaurar scroll cuando el modal se cierra o el componente se desmonta
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

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
                    maxWidth: '48rem',
                    maxHeight: '90vh',
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
                                📝 ¿Cómo crear una reseña?
                            </h2>
                            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                                Sigue estos pasos para compartir tu experiencia de intercambio
                            </p>
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
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Paso 1 */}
                        <div style={{
                            backgroundColor: '#eff6ff',
                            borderRadius: '0.75rem',
                            padding: '2rem',
                            border: '2px solid #dbeafe'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    backgroundColor: '#3b82f6',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem',
                                    marginRight: '1rem'
                                }}>
                                    1
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                                    Registrarse o Iniciar Sesión
                                </h3>
                            </div>
                            <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1.125rem', marginBottom: '1rem' }}>
                                Primero necesitas tener una cuenta para poder crear reseñas. <span className='font-bold'>Omite este paso si ya tienes una cuenta o estás logueado.</span>
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {session ? <></> : <>
                                    <Link
                                        to="/signup"
                                        onClick={onClose}
                                        style={{
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            display: 'inline-block',
                                            fontSize: '1rem'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                    >
                                        📝 Registrarse
                                    </Link>

                                    <Link
                                        to="/signin"
                                        onClick={onClose}
                                        style={{
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            display: 'inline-block',
                                            fontSize: '1rem'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                                    >
                                        🔑 Iniciar Sesión
                                    </Link></>}
                            </div>
                        </div>

                        {/* Paso 2 */}
                        <div style={{
                            backgroundColor: '#fef3c7',
                            borderRadius: '0.75rem',
                            padding: '2rem',
                            border: '2px solid #fde68a'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    backgroundColor: '#f59e0b',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem',
                                    marginRight: '1rem'
                                }}>
                                    2
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                                    Buscar y Seleccionar Universidad
                                </h3>
                            </div>
                            <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1.125rem', marginBottom: '1rem' }}>
                                Encuentra la universidad donde realizaste tu intercambio y selecciónala.
                            </p>
                            <Link
                                to="/universidades"
                                onClick={onClose}
                                style={{
                                    backgroundColor: '#f59e0b',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    fontSize: '1rem'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
                            >
                                🔍 Ver Universidades
                            </Link>
                        </div>

                        {/* Paso 3 */}
                        <div style={{
                            backgroundColor: '#ecfdf5',
                            borderRadius: '0.75rem',
                            padding: '2rem',
                            border: '2px solid #a7f3d0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    backgroundColor: '#10b981',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem',
                                    marginRight: '1rem'
                                }}>
                                    3
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                                    Crear la Reseña
                                </h3>
                            </div>
                            <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1.125rem', marginBottom: '1rem' }}>
                                Una vez en la página de la universidad, haz clic en el botón "Dejar reseña" y completa el formulario con tu experiencia.
                            </p>
                            <div style={{
                                backgroundColor: '#d1fae5',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #a7f3d0'
                            }}>
                                <p style={{ color: '#065f46', fontSize: '1rem', margin: 0 }}>
                                    💡 <strong>Tip:</strong> Puedes hacer tu reseña anónima si prefieres mantener tu privacidad.
                                </p>
                            </div>
                        </div>

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
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
} 