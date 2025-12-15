/**
 * ColorSelector Component
 * Renders a color picker with circular swatches
 */
export default function ColorSelector({ colors, selectedColor, onColorChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        Color: <span className="font-normal text-gray-600">{selectedColor}</span>
      </label>
      <div className="flex items-center gap-2.5">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.name)}
            className={`w-10 h-10 rounded-full border-2 transition-all relative ${
              selectedColor === color.name
                ? 'border-gray-900 scale-110'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {color.name === 'White' && (
              <div className="absolute inset-0 border border-gray-200 rounded-full"></div>
            )}
            {selectedColor === color.name && (
              <div className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-gray-900"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
