import React from "react";

export default function RatingBar({ value = 0, onChange }) {
  return (
    <div className="flex items-center space-x-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Calificar con ${star} estrellas`}
          onClick={() => onChange && onChange(star)}
          className="focus:outline-none"
        >
          <svg
            className={`w-8 h-8 ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-gray-700 font-semibold text-lg">{value.toFixed(1)}</span>
    </div>
  );
}