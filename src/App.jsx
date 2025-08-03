import './App.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from './context/AuthContext';
import { useEffect } from 'react';
import supabase from './config/supabaseClient';
import UniversityCard from './components/UniversityCard';

function App() {
  // Estados
  const [search, setSearch] = useState("");
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]); // se usará para almacenar las top 6 universidades mejor rankeadas
  const [currentSlide, setCurrentSlide] = useState(0); // controla que slide del carroussel se muestra

  // Función que maneja la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() === "") return;

    navigate(`/universidades?query=${encodeURIComponent(search.trim())}`);
  };

  // Función que obtiene las mejores 9 universidades (mejor rankeadas) (se renderiza una única vez por el "[]")
  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("universities")
        .select("*")
        .order("global_rating", { ascending: false, nullsFirst: false })
        .limit(9);

      if (error) {
        console.log("Ocurrió un error", error);
        setResults([]);
      } else {
        setResults(data || []);
        console.log("Resultados encontrados:", data);
      }
    };

    fetchResults();
  }, [])

  // Funciones para el carrusel
  const nextSlide = () => {
    const totalSlides = Math.ceil(results.length / 3);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    console.log("Next slide clicked. Current slide:", currentSlide, "Total slides:", totalSlides);
  };

  const prevSlide = () => {
    const totalSlides = Math.ceil(results.length / 3);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    console.log("Prev slide clicked. Current slide:", currentSlide, "Total slides:", totalSlides);
  };

  // Calcular qué universidades mostrar en el slide actual
  const getCurrentUniversities = () => {
    const startIndex = currentSlide * 3;
    const universities = results.slice(startIndex, startIndex + 3);
    console.log("Current slide:", currentSlide, "Start index:", startIndex, "Universities:", universities);
    return universities;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4 pt-40">
      <h1 className="text-blue-500 text-4xl font-bold mb-4 text-center">¿Qué universidad estás buscando?</h1>
      <p className="text-gray-600 text-lg text-center mb-1">Descubre calificaciones, opiniones y reseñas de todas las universidades disponibles</p>
      <p className="text-gray-600 text-lg text-center mb-8">para realizar tu intercambio académico en la UC.</p>
      <form onSubmit={handleSearch} className="w-full max-w-xl flex items-center mb-8">
        <input
          type="text"
          id='search'
          name='search'
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Busca una universidad..."
          className="flex-1 px-5 py-3 border border-blue-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400 bg-white shadow-sm"
        />
        <button
          type="submit"
          className="hover:cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-r-lg font-semibold shadow transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          Buscar
        </button>
      </form>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-xl mb-40">
        <button
          className="hover:cursor-pointer w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors"
          onClick={() => navigate('/universidades')}
        >
          Ver todas las universidades
        </button>
        <button
          className="hover:cursor-pointer w-full md:w-auto bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-2 px-6 rounded-lg shadow transition-colors"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      {/* Carrusel de Universidades Destacadas */}
      {results.length > 0 && (
        <div className="w-full max-w-6xl mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Universidades Destacadas</h2>
            <p className="text-gray-600">Las mejores universidades según las calificaciones de los estudiantes</p>
          </div>

          <div className="relative">
            {/* Botones de navegación */}
            {results.length > 3 && (
              <>
                <button
                  onClick={prevSlide}
                  className="hover:cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="hover:cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Contenedor del carrusel */}
            <div className="overflow-hidden">
              <div className="flex gap-6 px-4 justify-center transition-all duration-300 ease-in-out">
                {getCurrentUniversities().map((university) => (
                  <div key={university.id} className="w-80 flex-shrink-0">
                    <UniversityCard university={university} />
                  </div>
                ))}
              </div>
            </div>

            {/* Indicadores de slide */}
            {results.length > 3 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(results.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`hover:cursor-pointer  w-3 h-3 rounded-full transition-all duration-200 ${currentSlide === index
                      ? 'bg-blue-500 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Incentivo para crear cuenta */}
      {!session && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 mt-25">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Ya tienes experiencia en el extranjero?</h3>
          <p className="mb-4">Comparte tu experiencia y ayuda a otros estudiantes a tomar la mejor decisión.</p>
          <div className='flex gap-3'>
            <a href="/signup" className="hover:cursor-pointer w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors">Crear cuenta</a>
            <a href="/signin" className="hover:cursor-pointer w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors">Iniciar sesión</a>
          </div>
        </div>
      )}
    </div>
  )
}

export default App