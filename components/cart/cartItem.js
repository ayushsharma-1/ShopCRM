import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/lib/redux/slices/cartSlice";


export default function cartItem({ item }) {
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
        <div>
            <img src={item.image} alt = {item.name}/>
            <div>
                <h3>{item.name}</h3>
                <p>Category: ${item.category}</p>
                <p>Price: ${item.price}</p>
            </div>
            <div>
                <button onClick={() => handleQuantityChange(item.quantity-1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.quantity+1)}>+</button>
            </div>
            <div>
                <p>SunTotal</p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div>
                <button onClick={handleRemove}>Remove</button>
            </div>
        </div>
    )
}
