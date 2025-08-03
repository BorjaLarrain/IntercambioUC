import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import ReviewForm from "../components/ReviewForm";
import ReviewCard from "../components/ReviewCard";
import { UserAuth } from "../context/AuthContext";

export default function University() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [university, setUniversity] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const { session } = UserAuth();
    const user = session?.user;

    // Verificar si el usuario ya ha dejado un review
    const userHasReviewed = reviews.some(review => review.user_id === user?.id);

    useEffect(() => {
        const fetchUniversity = async () => {
            const { data, error } = await supabase
                .from('universities')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setFetchError('No pudimos encontrar dicha universidad');
                setUniversity(null);
                navigate('/');
            } else {
                setUniversity(data);
                setFetchError(null);
            }
        };

        const fetchReviews = async () => {
            // En el llamado a la base de datos se hace un "JOIN" con la tabla
            // "profiles" a través de la llave foránea "user_id". Esto se hace
            // para obtener el "username" del creador de dicha review
            const { data, error } = await supabase
                .from('reviews')
                .select('*, profiles:profiles!user_id(username)')
                .eq('university_id', Number(id));

            if (error) {
                setFetchError('No pudimos encontrar reviews para esta universidad');
                console.log(error.message)
                setReviews([]);
                navigate('/');
            } else {
                setReviews(data);
                setFetchError(null);
            }
        };

        fetchUniversity();
        fetchReviews();
    }, [id, navigate]);

    // FUNCIONES DE CÁLCULO DE RATINGS (de university_and_home_pages)
    const calcularRatingMovilidad = () => {
        if (!reviews || reviews.length === 0) return null;
        const ratings = reviews
            .map(r => typeof r.connectivity_rating === 'number' ? r.connectivity_rating : parseFloat(r.connectivity_rating))
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        return sum / ratings.length;
    };

    const calcularRatingCostoDeVida = () => {
        if (!reviews || reviews.length === 0) return null;
        const ratings = reviews
            .map(r => typeof r.cost_of_living_rating === 'number' ? r.cost_of_living_rating : parseFloat(r.cost_of_living_rating))
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        return sum / ratings.length;
    };

    const calcularRatingHousing = () => {
        if (!reviews || reviews.length === 0) return null;
        const ratings = reviews
            .map(r => typeof r.housing_rating === 'number' ? r.housing_rating : parseFloat(r.housing_rating))
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        return sum / ratings.length;
    };

    const calcularRatingExperienciaAcademica = () => {
        if (!reviews || reviews.length === 0) return null;
        const ratings = reviews
            .map(r => typeof r.academic_experience_rating === 'number' ? r.academic_experience_rating : parseFloat(r.academic_experience_rating))
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        return sum / ratings.length;
    };

    const calcularRatingCalidadDeVida = () => {
        if (!reviews || reviews.length === 0) return null;
        const ratings = reviews
            .map(r => typeof r.social_life_rating === 'number' ? r.social_life_rating : parseFloat(r.social_life_rating))
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        return sum / ratings.length;
    };

    const calcularRatingGlobal = () => {
        if (!reviews || reviews.length === 0) return null;
        const sum = calcularRatingMovilidad() + calcularRatingCostoDeVida() + calcularRatingHousing() + calcularRatingCalidadDeVida() + calcularRatingExperienciaAcademica();
        return sum / 5;
    };

    // FUNCIONES DEL MODAL (de develop)
    const handleOpenModal = () => {
        if (!user) {
            setMessage("Debes iniciar sesión para dejar un review.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMessage("");
    };

    const handleSubmitReview = async (form) => {
        // Verificar que el usuario esté autenticado
        if (!user) {
            setMessage("Debes iniciar sesión para enviar un review.");
            return;
        }

        // Calcular rating global
        const globalRating = (
            form.connectivity.rating +
            form.housing.rating +
            form.cost_of_living.rating +
            form.social_life.rating +
            form.academic_experience.rating
        ) / 5;

        const reviewData = {
            university_id: Number(id),
            user_id: user.id,
            anonymous: form.anonymous || false,
            semester: form.semester,
            connectivity_rating: form.connectivity.rating || 0,
            connectivity_description: form.connectivity.comment || "",
            housing_rating: form.housing.rating || 0,
            housing_description: form.housing.comment || "",
            cost_of_living_rating: form.cost_of_living.rating || 0,
            cost_of_living_description: form.cost_of_living.comment || "",
            social_life_rating: form.social_life.rating || 0,
            social_life_description: form.social_life.comment || "",
            academic_experience_rating: form.academic_experience.rating || 0,
            academic_experience_description: form.academic_experience.comment || "",
            general_description: form.general_description || "",
            total_rating: globalRating || 0,
        };

        console.log("Datos a insertar:", reviewData);
        const { error } = await supabase.from("reviews").insert([reviewData]);
        if (error) {
            console.error("Error de Supabase:", error);
            if (error.code === '23505') {
                setMessage("Ya has dejado un review para esta universidad. Solo puedes dejar uno por universidad.");
            } else {
                setMessage("Error al guardar el review. Intenta de nuevo.");
            }
        } else {
            setMessage("¡Review enviado con éxito!");
            setIsModalOpen(false);
            // Recarga los reviews
            const { data } = await supabase
                .from('reviews')
                .select('*, profiles:profiles!user_id(username)')
                .eq('university_id', Number(id));
            setReviews(data);
        }
    };

    if (!university) {
        return <div className="text-center mt-10">Cargando universidad...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center pt-20 pb-5">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
                {/* Name and location */}
                <div className="mb-1">
                    <h1 className="text-4xl font-bold text-blue-500 mb-2">{university.name}</h1>
                    <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {university.location}
                    </div>
                    <div className="flex items-center mb-4">
                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {university.continent}
                    </div>
                </div>
                {/* Global rating */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Calificación global</h2>
                    <div className="flex items-center text-3xl font-bold text-yellow-500 mb-2">
                        ★ {calcularRatingGlobal() !== null ? calcularRatingGlobal().toFixed(1) : "Esta universidad aún no tiene una calificación"}
                    </div>
                </div>
                {/* Ratings for each category */}
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-xl px-4 py-6 shadow-sm hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <div className="text-3xl mb-3">🚇</div>
                        <span className="text-base font-semibold text-blue-600 text-center mb-3">Movilidad</span>
                        <span className="text-3xl font-bold text-gray-800">{calcularRatingMovilidad() !== null ? calcularRatingMovilidad().toFixed(1) : "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-xl px-4 py-6 shadow-sm hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <div className="text-3xl mb-3">💰</div>
                        <span className="text-base font-semibold text-blue-600 text-center mb-3">Costo de vida</span>
                        <span className="text-3xl font-bold text-gray-800">{calcularRatingCostoDeVida() !== null ? calcularRatingCostoDeVida().toFixed(1) : "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-xl px-4 py-6 shadow-sm hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <div className="text-3xl mb-3">🏠</div>
                        <span className="text-base font-semibold text-blue-600 text-center mb-3">Alojamiento</span>
                        <span className="text-3xl font-bold text-gray-800">{calcularRatingHousing() !== null ? calcularRatingHousing().toFixed(1) : "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-xl px-4 py-6 shadow-sm hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <div className="text-3xl mb-3">🎉🎭</div>
                        <span className="text-base font-semibold text-blue-600 text-center mb-3">Vida Social y Cultural</span>
                        <span className="text-3xl font-bold text-gray-800">{calcularRatingCalidadDeVida() !== null ? calcularRatingCalidadDeVida().toFixed(1) : "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-xl px-4 py-6 shadow-sm hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <div className="text-3xl mb-3">📚</div>
                        <span className="text-base font-semibold text-blue-600 text-center mb-3">Experiencia Académica</span>
                        <span className="text-3xl font-bold text-gray-800">{calcularRatingExperienciaAcademica() !== null ? calcularRatingExperienciaAcademica().toFixed(1) : "N/A"}</span>
                    </div>
                </div>

                {/* Reviews */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Reseñas de estudiantes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
                        {reviews && reviews.length > 0 ? (
                            reviews.map((review, idx) => (
                                <ReviewCard key={idx} review={review} />
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-2 text-center">Aún no hay reseñas para esta universidad.</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-center my-6">
                    {!session ? (
                        <p className="font-bold text-red-700">Para dejar una reseña debes crearte una cuenta o iniciar sesión primero.</p>
                    ) : (
                        userHasReviewed ? (
                            <div className="text-center">
                                <p className="text-green-600 mb-2 font-semibold">✅ Ya has dejado un review para esta universidad</p>
                                <button
                                    className="bg-gray-400 text-white px-6 py-2 rounded-lg shadow cursor-not-allowed hover:cursor-pointer"
                                    disabled
                                >
                                    Dejar reseña
                                </button>
                            </div>
                        ) : (
                            <button
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition hover:cursor-pointer"
                                onClick={handleOpenModal}
                            >
                                Dejar reseña
                            </button>
                        )
                    )}
                    
                </div>
                {/* {message && <div className="text-center text-red-500 mb-4">{message}</div>} */}
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <ReviewForm onSubmit={handleSubmitReview} onCancel={handleCloseModal} />
                </Modal>
                {fetchError && <p>ERROR</p>}
            </div>
        </div>
    );
}