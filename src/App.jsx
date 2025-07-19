import './App.css'
import { useState } from "react";

// Components
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';

// Pages
import SignUp from './pages/SignUp';

// Extras
import { useNavigate } from "react-router-dom";
import { UserAuth } from './context/AuthContext';

function App() {
  // State para saber si el menú de MOBILE está abierto (true) o no (false)
  const [menuOpen, setMenuOpen] = useState(false);

  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <main className="flex flex-1 items-center justify-center pt-24 pb-16">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Página principal</h1>
          <h2 className="text-lg text-gray-700 mb-6">Bienvenido, {session?.user?.email}</h2>
          <button
            onClick={signOut}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </main>
    </div>
  )
}

export default App