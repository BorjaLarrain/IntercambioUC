import { useState, useEffect } from "react";
import RatingBar from "./RatingBar";
import CareerDropdown from "./CareerDropdown";

const steps = [
  { key: "anonymous", label: "¿Quieres que tu reseña sea anónima?", helper: "Tu nombre no será visible si eliges que sea anónimo." },
  { key: "semester", label: "Semestre de intercambio", helper: "¿En qué semestre realizaste tu intercambio?" },
  { key: "student_major", label: "Tu carrera universitaria 🎓", helper: "¿Qué carrera estudias en la UC? Puedes seleccionar 'Otra' si no está en la lista. O 'Prefiero no decirlo' si no quieres decirlo." },
  { key: "connectivity", label: "Movilidad 🚍✈️🚊", helper: "¿Era bueno el transporte público? ¿Qué tan fácil era moverse dentro y fuera de la ciudad? ¿Tenías un aeropuerto o estación de tren cerca? ¿La ciudad/campus era caminable? ¿La ciudad estaba bien ubicada dentro de la región/continente?" },
  { key: "cost_of_living", label: "Costo de vida ��", helper: "¿Era caro vivir ahí? ¿Qué gastos eran los más altos? ¿Qué era más caro comparado con Chile? (alojamiento, comida, transporte, entretenimiento) (Más estrellas = más barato)"},
  { key: "housing", label: "Alojamiento ��", helper: "¿Cómo era la calidad y precio del alojamiento? ¿Era difícil encontrar un lugar para vivir? ¿Estaba bien ubicado?" },
  { key: "social_life", label: "Vida Social y Cultural 🎉🎭", helper: "¿Había actividades sociales/culturales para estudiantes? ¿Era fácil hacer amigos locales/internacionales?" },
  { key: "academic_experience", label: "Experiencia Académica 📚", helper: "¿Era buena la oferta de ramos disponibles para alumnos de intercambio? ¿Qué ramos cursaste? ¿Fueron fáciles de convalidar? ¿Era buena la calidad de los cursos? ¿Eran fáciles o difíciles comparados con Chile?" },
  { key: "general_description", label: "Descripción general ��", helper: "Danos una breve descripción de tu experiencia. Si quieres puedes agregar cosas que no fueron cubiertas en los otros campos. Lo que respondas en este campo saldrá en el encabezado de tu reseña." },
  { key: "share_email", label: "¿Quieres compartir tu email? 📧", helper: "Si eliges compartir tu email, otros estudiantes podrán contactarte para hacer preguntas sobre tu experiencia. Solo será visible si tu reseña no es anónima." }
];

export default function EditReviewForm({ review, onSubmit, onCancel }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    anonymous: false,
    semester: "",
    student_major: "",
    connectivity: { rating: 0, comment: "" },
    housing: { rating: 0, comment: "" },
    cost_of_living: { rating: 0, comment: "" },
    social_life: { rating: 0, comment: "" },
    academic_experience: { rating: 0, comment: "" },
    general_description: "",
    share_email: true,
  });

  const current = steps[step];

  // Cargar datos del review existente
  useEffect(() => {
    if (review) {
      setForm({
        anonymous: review.anonymous || false,
        semester: review.semester || "",
        student_major: review.student_major || "",
        connectivity: { 
          rating: review.connectivity_rating || 0, 
          comment: review.connectivity_description || "" 
        },
        housing: { 
          rating: review.housing_rating || 0, 
          comment: review.housing_description || "" 
        },
        cost_of_living: { 
          rating: review.cost_of_living_rating || 0, 
          comment: review.cost_of_living_description || "" 
        },
        social_life: { 
          rating: review.social_life_rating || 0, 
          comment: review.social_life_description || "" 
        },
        academic_experience: { 
          rating: review.academic_experience_rating || 0, 
          comment: review.academic_experience_description || "" 
        },
        general_description: review.general_description || "",
        share_email: review.profiles?.share_email || false,
      });
    }
  }, [review]);

  const handleRating = (value) => {
    setForm((prev) => ({
      ...prev,
      [current.key]: { ...prev[current.key], rating: value },
    }));
  };

  const handleComment = (e) => {
    setForm((prev) => ({
      ...prev,
      [current.key]: { ...prev[current.key], comment: e.target.value },
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStep((s) => s + 1);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStep((s) => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Solo enviar si estamos en el último paso Y la descripción general no está vacía
    if (step === steps.length - 1 && form.general_description.trim() !== "") {
      onSubmit(form);
    }
  };

  const semesterOptions = [];
  for (let year = 2025; year >= 2015; year--) {
    semesterOptions.push(`${year}-2`);
    semesterOptions.push(`${year}-1`);
  }

  return (
    <form
      className="w-full flex flex-col items-center"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center tracking-tight">
        Editar Review
      </h2>
      <h3 className="text-xl font-bold mb-2 text-gray-600 text-center tracking-tight">
        {current.label}
      </h3>
      <p className="mb-6 text-gray-500 text-center">{current.helper}</p>

      {current.key === "anonymous" ? (
        <div className="w-full flex flex-col items-center mb-6">
          <div className="flex gap-4">
            <button
              type="button"
              className={`hover:cursor-pointer px-4 py-2 rounded-lg shadow transition-colors font-semibold ${form.anonymous ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-100 hover:bg-blue-200 text-blue-600"}`}
              onClick={() => setForm(prev => ({ ...prev, anonymous: true }))}
            >
              Sí
            </button>
            <button
              type="button"
              className={`hover:cursor-pointer px-4 py-2 rounded-lg shadow transition-colors font-semibold ${!form.anonymous ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-100 hover:bg-blue-200 text-blue-600"}`}
              onClick={() => setForm(prev => ({ ...prev, anonymous: false }))}
            >
              No
            </button>
          </div>
        </div>
      ) : current.key === "semester" ? (
        <select
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={form.semester}
          onChange={e => setForm(prev => ({ ...prev, semester: e.target.value }))}
          required
        >
          <option value="">Selecciona un semestre</option>
          {semesterOptions.map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>
      ) : current.key === "student_major" ? (
        <div className="w-full mb-6">
          <CareerDropdown
            value={form.student_major}
            onChange={(value) => setForm(prev => ({ ...prev, student_major: value }))}
            required
          />
        </div>
      ) : current.key === "general_description" ? (
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none min-h-[100px]"
          placeholder="Escribe aquí tu experiencia general..."
          value={form.general_description}
          onChange={e => setForm(prev => ({ ...prev, general_description: e.target.value }))}
          required
        />
      ) : current.key === "share_email" ? (
        <div className="w-full flex flex-col items-center mb-6">
          <div className="flex gap-4">
            <button
              type="button"
              className={`hover:cursor-pointer px-4 py-2 rounded-lg shadow transition-colors font-semibold ${form.share_email ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-100 hover:bg-blue-200 text-blue-600"}`}
              onClick={() => setForm(prev => ({ ...prev, share_email: true }))}
            >
              Sí, compartir mi email
            </button>
            <button
              type="button"
              className={`hover:cursor-pointer px-4 py-2 rounded-lg shadow transition-colors font-semibold ${!form.share_email ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-100 hover:bg-blue-200 text-blue-600"}`}
              onClick={() => setForm(prev => ({ ...prev, share_email: false }))}
            >
              No, no compartir
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-center w-full">
            <RatingBar
              value={form[current.key].rating}
              onChange={handleRating}
            />
          </div>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none min-h-[80px]"
            placeholder="Comentario (opcional)"
            value={form[current.key].comment}
            onChange={handleComment}
          />
        </>
      )}
      
      <div className="flex justify-between w-full gap-2">
        {step > 0 && (
          <button
            type="button"
            className="hover:cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-2 px-4 rounded-lg shadow transition-colors flex-1"
            onClick={handlePrev}
          >
            Anterior
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="hover:cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors flex-1"
            onClick={handleNext}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            disabled={
              current.key !== "anonymous" && 
              current.key !== "semester" && 
              current.key !== "student_major" && 
              current.key !== "general_description" &&
              current.key !== "share_email" &&
              form[current.key].rating === 0
            }
          >
            Siguiente
          </button>
        ) : (
          <button
            type="submit"
            className="hover:cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors flex-1"
            disabled={form.general_description.trim() === ""}
          >
            Actualizar Review
          </button>
        )}
      </div>
      
      <button
        type="button"
        className="hover:cursor-pointer mt-6 bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-2 px-4 rounded-lg shadow transition-colors w-full text-center"
        onClick={onCancel}
      >
        Cancelar
      </button>
    </form>
  );
}