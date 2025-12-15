/**
 * SizeSelector Component
 * Renders size options as buttons
 */
export default function SizeSelector({ sizes, selectedSize, onSizeChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        Size: <span className="font-normal text-gray-600">{selectedSize}</span>
      </label>
      <div className="flex items-center gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
              selectedSize === size
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
