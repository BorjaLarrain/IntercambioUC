export default function RatingBar({ label, value }) {
    return (
        <div className="flex items-center mb-2">
            <span className="w-32 font-medium">{label}:</span>
            <div className="flex-1 h-3 bg-gray-200 rounded mx-2">
                <div
                    className="h-3 bg-blue-500 rounded"
                    style={{ width: `${value * 20}%` }}
                />
            </div>
            <span className="w-8 text-right">{value.toFixed(1)}</span>
        </div>
    )
}