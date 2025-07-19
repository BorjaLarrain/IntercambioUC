import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import RatingBar from "../components/RatingBar";
import { useParams, useNavigate } from "react-router-dom";

export default function University() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [university, setUniversity] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [fetchError, setFetchError] = useState(null);

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

    if (!university) {
        return <div className="text-center mt-10">Cargando universidad...</div>;
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
                {fetchError && <p>ERROR</p>}
            </div>
        </div>
    );
}