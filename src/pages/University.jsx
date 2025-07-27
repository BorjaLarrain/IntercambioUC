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
    
    // // Función que calcula el rating global de la universidad
    // const calcularRatingGlobal = () => {
    //     if (!reviews || reviews.length === 0) return null;

    //     // bueas
    //     const ratings = reviews
    //         .map(r => typeof r.global_rating === 'number' ? r.global_rating : parseFloat(r.global_rating))

    //     // Se obtiene suma total
    //     const sum = ratings.reduce((acc, curr) => acc + curr, 0);

    //     // Se calcula y retorna el promedio
    //     return sum / ratings.length;
    // };

    // Función que calcula el rating de la movilidad de la universidad
    const calcularRatingMovilidad = () => {
        if (!reviews || reviews.length === 0) return null;

        // bueas
        const ratings = reviews
            .map(r => typeof r.connectivity_rating === 'number' ? r.connectivity_rating : parseFloat(r.connectivity_rating))

        // Se obtiene suma total
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);

        // Se calcula y retorna el promedio
        return sum / ratings.length;
    };

    // Función que calcula el rating del Costo de Vida de la universidad
    const calcularRatingCostoDeVida = () => {
        if (!reviews || reviews.length === 0) return null;

        // bueas
        const ratings = reviews
            .map(r => typeof r.cost_of_living_rating === 'number' ? r.cost_of_living_rating : parseFloat(r.cost_of_living_rating))

        // Se obtiene suma total
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);

        // Se calcula y retorna el promedio
        return sum / ratings.length;
    };

    // Función que calcula el rating del Housing de la universidad
    const calcularRatingHousing = () => {
        if (!reviews || reviews.length === 0) return null;

        // bueas
        const ratings = reviews
            .map(r => typeof r.housing_rating === 'number' ? r.housing_rating : parseFloat(r.housing_rating))

        // Se obtiene suma total
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);

        // Se calcula y retorna el promedio
        return sum / ratings.length;
    };

    // Función que calcula el rating de la Calidad de Vida de la universidad
    const calcularRatingCalidadDeVida = () => {
        if (!reviews || reviews.length === 0) return null;

        // bueas
        const ratings = reviews
            .map(r => typeof r.social_life_rating === 'number' ? r.social_life_rating : parseFloat(r.social_life_rating))

        // Se obtiene suma total
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);

        // Se calcula y retorna el promedio
        return sum / ratings.length;
    };

    // Función que calcula el rating global de la universidad (a partir del promedio de los ratings de las diversas categorías)
    const calcularRatingGlobal = () => {
        if (!reviews || reviews.length === 0) return null;

        // Se obtiene suma total
        const sum = calcularRatingMovilidad() + calcularRatingCostoDeVida() + calcularRatingHousing() + calcularRatingCalidadDeVida();

        // Se calcula y retorna el promedio
        return sum / 4;
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
                {fetchError && <p>ERROR</p>}
            </div>
        </div>
    );
}