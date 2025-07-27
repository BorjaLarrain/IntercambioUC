import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import RatingBar from "../components/RatingBar";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import ReviewForm from "../components/ReviewForm";
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

    const calcularRatingCalidadDeVida = () => {
        if (!reviews || reviews.length === 0) return null;
        const ratings = reviews
            .map(r => typeof r.social_life_rating === 'number' ? r.social_life_rating : parseFloat(r.social_life_rating))
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        return sum / ratings.length;
    };

    const calcularRatingGlobal = () => {
        if (!reviews || reviews.length === 0) return null;
        const sum = calcularRatingMovilidad() + calcularRatingCostoDeVida() + calcularRatingHousing() + calcularRatingCalidadDeVida();
        return sum / 4;
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
        const reviewData = {
            university_id: Number(id),
            user_id: user.id,
            anonymous: form.anonymous,
            semester: form.semester,
            connectivity_rating: form.connectivity.rating,
            connectivity_description: form.connectivity.comment,
            housing_rating: form.housing.rating,
            housing_description: form.housing.comment,
            cost_of_living_rating: form.cost_of_living.rating,
            cost_of_living_description: form.cost_of_living.comment,
            social_life_rating: form.social_life.rating,
            social_life_description: form.social_life.comment,
            general_description: form.general_description,
        };

        const { error } = await supabase.from("reviews").insert([reviewData]);
        if (error) {
            setMessage("Error al guardar el review. Intenta de nuevo.");
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
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-blue-500 mb-2">{university.name}</h1>
                    <p className="text-lg text-gray-600">{university.location}</p>
                </div>
                {/* Global rating */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Calificación global</h2>
                    <div className="flex items-center text-3xl font-bold text-yellow-500 mb-2">
                        ★ {calcularRatingGlobal() !== null ? calcularRatingGlobal().toFixed(1) : "Esta universidad aún no tiene una calificación"}
                    </div>
                </div>
                {/* Ratings for each category */}
                <div className="w-full flex flex-wrap items-center justify-center gap-4 my-4">
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-lg px-6 py-3 shadow-sm min-w-[160px] hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <span className="text-lg font-semibold text-blue-600">Movilidad</span>
                        <span className="text-2xl font-bold text-gray-800">{calcularRatingMovilidad() !== null ? calcularRatingMovilidad().toFixed(1) : "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-lg px-6 py-3 shadow-sm min-w-[160px] hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <span className="text-lg font-semibold text-blue-600">Costo de vida</span>
                        <span className="text-2xl font-bold text-gray-800">{calcularRatingCostoDeVida() !== null ? calcularRatingCostoDeVida().toFixed(1) : "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-lg px-6 py-3 shadow-sm min-w-[160px] hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <span className="text-lg font-semibold text-blue-600">Housing</span>
                        <span className="text-2xl font-bold text-gray-800">{calcularRatingHousing() !== null ? calcularRatingHousing().toFixed(1) : "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-lg px-6 py-3 shadow-sm min-w-[160px] hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all">
                        <span className="text-lg font-semibold text-blue-600">Calidad de vida</span>
                        <span className="text-2xl font-bold text-gray-800">{calcularRatingCalidadDeVida() !== null ? calcularRatingCalidadDeVida().toFixed(1) : "N/A"}</span>
                    </div>
                </div>

                {/* Reviews */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Reseñas de estudiantes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
                        {reviews && reviews.length > 0 ? (
                            reviews.map((review, idx) => (
                                <div
                                    key={idx}
                                    className="w-full max-w-xl bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-[0_4px_16px_rgba(50,130,246,0.15)] hover:-translate-y-1 transition-all"
                                >
                                    <div className="mb-1">
                                        <span className="font-bold text-blue-500 mr-3">
                                            {review.profiles?.username ?? "Anónimo"} | {review.semester}
                                        </span>
                                    </div>
                                    <div className="mb-1">
                                        <span className="text-yellow-500 text-lg">
                                            ★ {review.global_rating?.toFixed(1) ?? "N/A"}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-base">{review.general_description || "Sin comentario"}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-2 text-center">Aún no hay reseñas para esta universidad.</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-center my-6">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                        onClick={handleOpenModal}
                    >
                        Dejar review
                    </button>
                </div>
                {message && <div className="text-center text-red-500 mb-4">{message}</div>}
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <ReviewForm onSubmit={handleSubmitReview} onCancel={handleCloseModal} />
                </Modal>
                {fetchError && <p>ERROR</p>}
            </div>
        </div>
    );
}