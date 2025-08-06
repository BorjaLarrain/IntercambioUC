import React, { useState, useRef, useEffect } from "react";

const careers = [
  "Actuación",
  "Administración Pública",
  "Agronomía",
  "Antropología",
  "Arqueología",
  "Arquitectura",
  "Arte",
  "Astronomía",
  "Bachillerato en Ciencias Naturales y Matemática",
  "Bachillerato en Ciencias Sociales",
  "Bachillerato en Ciencias Sociales - Campus Villarrica",
  "Biología",
  "Biología Marina",
  "Bioquímica",
  "Ciencia Política",
  "College Artes y Humanidades",
  "College Ciencias Naturales y Matemáticas",
  "College Ciencias Sociales",
  "Construcción Civil",
  "Derecho",
  "Dirección Audiovisual",
  "Diseño",
  "Enfermería",
  "Estadística",
  "Estética",
  "Filosofía",
  "Física",
  "Fonoaudiología",
  "Geografía",
  "Historia",
  "Ingeniería",
  "Ingeniería Comercial",
  "Ingeniería en Recursos Naturales",
  "Ingeniería Forestal",
  "Interpretación Musical",
  "Kinesiología",
  "Letras Hispánicas",
  "Letras Inglesas",
  "Licenciatura en Ingeniería en Ciencia de Datos",
  "Licenciatura en Ingeniería en Ciencia de la Computación",
  "Matemática",
  "Medicina",
  "Medicina Veterinaria",
  "Música",
  "Nutrición y Dietética",
  "Odontología",
  "Pedagogía en Educación Especial",
  "Pedagogía en Educación Física y Salud",
  "Pedagogía en Educación General Básica - Santiago",
  "Pedagogía en Educación Media",
  "Pedagogía en Educación Media en Ciencias Naturales y Biología",
  "Pedagogía en Educación Media en Física",
  "Pedagogía en Educación Media en Matemática",
  "Pedagogía en Educación Media en Química",
  "Pedagogía en Educación Parvularia - Santiago",
  "Pedagogía en Educación Parvularia - Villarrica",
  "Pedagogía en Inglés para Educación Básica y Media",
  "Pedagogía en Religión Católica",
  "Pedagogía General Básica - Campus Villarrica",
  "Periodismo",
  "Planificación Urbana",
  "Psicología",
  "Publicidad",
  "Química",
  "Química y Farmacia",
  "Sociología",
  "Teología",
  "Terapia Ocupacional",
  "Trabajo Social",
  "Otra",
  "Prefiero no decirlo"
];

export default function CareerDropdown({ value, onChange, required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filtrar carreras basado en el término de búsqueda
  const filteredCareers = careers.filter(career =>
    career.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (career) => {
    onChange(career);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Busca tu carrera..."
        value={isOpen ? searchTerm : value}
        onChange={handleInputChange}
        onClick={handleInputClick}
        required={required}
      />
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCareers.length > 0 ? (
            filteredCareers.map((career) => (
              <div
                key={career}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
                onClick={() => handleSelect(career)}
              >
                {career}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">
              No se encontraron carreras
            </div>
          )}
        </div>
      )}
    </div>
  );
} 