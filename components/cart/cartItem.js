import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/lib/redux/slices/cartSlice";

export default function CartItem({ item }) {
    const dispatch = useDispatch();

    const handleRemove = () => {
        dispatch(removeFromCart(item.id));
    }
    const handleQuantityChange = (newQuantity) => {
        if(newQuantity < 1) return;
        if (newQuantity > item.stock) return;
        dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 flex flex-col md:flex-row gap-6 items-center">
            <img 
                src={item.image} 
                alt={item.name} 
                className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                {item.category && (
                    <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
                )}
                <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => handleQuantityChange(item.quantity-1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full font-bold transition-colors"
                >
                    -
                </button>
                <span className="text-lg font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                <button 
                    onClick={() => handleQuantityChange(item.quantity+1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full font-bold transition-colors"
                >
                    +
                </button>
            </div>
            <div className="text-center md:text-right">
                <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                <p className="text-2xl font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div>
                <button 
                    onClick={handleRemove}
                    className="text-red-600 hover:text-red-800 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                    Remove
                </button>
            </div>
        </div>
    )
}
