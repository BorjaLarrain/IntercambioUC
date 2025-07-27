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
        console.log("ID recibido desde useParams:", id, typeof id);
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
            const { data, error } = await supabase
                .from('reviews')
                .select()
                .eq('university_id', Number(id));

            if (error) {
                setFetchError('No pudimos encontrar reviews para esta universidad');
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

    const handleOpenModal = () => {
        //if (!user) {
        //    setMessage("Debes iniciar sesión para dejar un review.");
        //    return;
        //}
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMessage("");
    };

    const handleSubmitReview = async (form) => {
        // Prepara los datos para Supabase
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
            // Puedes agregar más campos si tu tabla los tiene
        };

        const { error } = await supabase.from("reviews").insert([reviewData]);
        if (error) {
            setMessage("Error al guardar el review. Intenta de nuevo.");
        } else {
            setMessage("¡Review enviado con éxito!");
            setIsModalOpen(false);
            // Opcional: recarga los reviews
            const { data } = await supabase
                .from('reviews')
                .select()
                .eq('university_id', Number(id));
            setReviews(data);
        }
    };

    if (!university) {
        return <div className="text-center mt-10">Cargando universidad...</div>;
    }

    const semesterOptions = [];
    for (let year = 2025; year >= 2015; year--) {
      semesterOptions.push(`${year}-2`);
      semesterOptions.push(`${year}-1`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center pt-24 pb-16">
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
                        ★ {university.global_rating?.toFixed(1) ?? "N/A"}
                    </div>
                </div>
                {/* Ratings for each category */}
                <div className="w-full flex flex-wrap items-center justify-center gap-4 my-4">
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-lg px-6 py-3 shadow-sm min-w-[160px]">
                        <span className="text-lg font-semibold text-blue-600">Movilidad</span>
                        <span className="text-2xl font-bold text-gray-800">{university.connectivity_rating}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-lg px-6 py-3 shadow-sm min-w-[160px]">
                        <span className="text-lg font-semibold text-blue-600">Costo de vida</span>
                        <span className="text-2xl font-bold text-gray-800">{university.cost_of_living_rating}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-lg px-6 py-3 shadow-sm min-w-[160px]">
                        <span className="text-lg font-semibold text-blue-600">Housing</span>
                        <span className="text-2xl font-bold text-gray-800">{university.housing_rating}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white border-2 border-blue-200 rounded-lg px-6 py-3 shadow-sm min-w-[160px]">
                        <span className="text-lg font-semibold text-blue-600">Calidad de vida</span>
                        <span className="text-2xl font-bold text-gray-800">{university.social_life_rating}</span>
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
                                    <div className="flex items-center mb-2">
                                        <span className="font-bold text-blue-500 mr-3">{review.user_id ?? "Anónimo"}</span>
                                        <span className="text-yellow-500 text-lg">★ {review.global_rating?.toFixed(1) ?? "N/A"}</span>
                                    </div>
                                    <p className="text-gray-700 text-base">{review.connectivity_description || "Sin comentario"}</p>
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