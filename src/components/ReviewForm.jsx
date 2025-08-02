import { useState } from "react";
import RatingBar from "./RatingBar";

const steps = [
  { key: "anonymous", label: "¿Quieres que tu review sea anónimo?", helper: "Tu nombre no será visible si eliges que sea anónimo." },
  { key: "semester", label: "Semestre de intercambio", helper: "¿En qué semestre realizaste tu intercambio?" },
  { key: "connectivity", label: "Conectividad", helper: "¿Era bueno el transporte público? ¿Qué tan fácil era moverse dentro y fuera de la ciudad?" },
  { key: "housing", label: "Alojamiento", helper: "¿Cómo era la calidad y precio del alojamiento? ¿Era difícil encontrar un lugar para vivir?" },
  { key: "cost_of_living", label: "Costo de vida", helper: "¿Era caro vivir ahí? ¿Qué gastos eran los más altos?" },
  { key: "social_life", label: "Vida social", helper: "¿Había actividades para estudiantes? ¿Era fácil hacer amigos?" },
  { key: "academic_experience", label: "Experiencia Académica", helper: "¿Era buena la oferta de ramos disponibles para alumnos de intercambio? ¿Fueron fáciles de convalidar? ¿Qué ramos cursaste? ¿Era buena la calidad de los cursos?" },
  { key: "general_description", label: "Descripción general", helper: "Danos una breve descripción de tu experiencia. Si quieres, puedes agregar cosas que no fueron cubiertas en los otros campos." }
];

export default function ReviewForm({ onSubmit, onCancel }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    anonymous: false,
    semester: "",
    connectivity: { rating: 0, comment: "" },
    housing: { rating: 0, comment: "" },
    cost_of_living: { rating: 0, comment: "" },
    social_life: { rating: 0, comment: "" },
    academic_experience: { rating: 0, comment: "" },
    general_description: "",
  });

  const current = steps[step];

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

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
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
        {current.label}
      </h2>
      <p className="mb-6 text-gray-500 text-center">{current.helper}</p>

      {current.key === "anonymous" ? (
        <div className="w-full flex flex-col items-center mb-6">
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-2 rounded ${form.anonymous ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setForm(prev => ({ ...prev, anonymous: true }))}
            >
              Sí
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${!form.anonymous ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
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
      ) : current.key === "general_description" ? (
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none min-h-[100px]"
          placeholder="Escribe aquí tu experiencia general..."
          value={form.general_description}
          onChange={e => setForm(prev => ({ ...prev, general_description: e.target.value }))}
          required
        />
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
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-semibold flex-1"
            onClick={handlePrev}
          >
            Anterior
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold flex-1"
            onClick={handleNext}
            disabled={current.key !== "anonymous" && current.key !== "semester" && form[current.key].rating === 0}
          >
            Siguiente
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold flex-1"
            disabled={form.general_description.trim() === ""}
          >
            Enviar
          </button>
        )}
      </div>
      <button
        type="button"
        className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded w-full text-center transition"
        onClick={onCancel}
      >
        Cancelar
      </button>
    </form>
  );
}
