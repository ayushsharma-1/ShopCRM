export default function Input({
    label,
    name,
    type='text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className = ''
})
{
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="block mb-1 font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}