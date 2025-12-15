/**
 * GenericSelector Component
 * Renders a generic option selector with buttons
 * Used for material, storage, and other future options
 */
export default function GenericSelector({ label, options, selectedValue, onValueChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        {label}: <span className="font-normal text-gray-600">{selectedValue}</span>
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onValueChange(option)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
              selectedValue === option
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
