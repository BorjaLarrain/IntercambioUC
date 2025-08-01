import './App.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from './context/AuthContext';

function App() {
  // Estados
  const [search, setSearch] = useState("");
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  // Función que maneja la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() === "") return;

    navigate(`/universidades?query=${encodeURIComponent(search.trim())}`);
  };


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4 pt-25">
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
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-xl">
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

      {!session && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 mt-20">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Ya tienes experiencia en el extranjero?</h3>
          <p className="mb-4">Comparte tu experiencia y ayuda a otros estudiantes a tomar la mejor decisión.</p>
          <button
            onClick={() => navigate('/signup')}
            className="hover:cursor-pointer w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors"
          >
            Crear cuenta
          </button>
        </div>
      )}
    </div>
  )
}

export default App