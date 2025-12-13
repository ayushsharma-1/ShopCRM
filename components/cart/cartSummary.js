import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function CartSummary() {
    const router = useRouter();
    // const { totalAmount, itemCount } = router.query;
    const {totalAmount, itemCount} = useSelector((state) => state.cart);
    const shippingCost = totalAmount > 100 ? 0 : 10;
    const tax = totalAmount * 0.1;
    const finalAmount = totalAmount + shippingCost + tax;

    const handleCheckout = () => {
        router.push('/checkout');
    }
    return (
        <div>
            <h2>Order Summary</h2>
            <div>
                <div>
                    <span>Items ({itemCount})</span>
                    <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div>
                    <span>Shipping: ${shippingCost.toFixed(2)}</span>
                </div>
                <div>
                    <span>Tax: ${tax.toFixed(2)}</span>
                </div>
                <div>
                    <span>Total: ${finalAmount.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    )
}