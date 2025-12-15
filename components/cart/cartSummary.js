'use client';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function CartSummary() {
    const router = useRouter();
    const {totalAmount, totalItem} = useSelector((state) => state.cart);
    const shippingCost = totalAmount > 100 ? 0 : 10;
    const tax = totalAmount * 0.1;
    const finalAmount = totalAmount + shippingCost + tax;

    const handleCheckout = () => {
        router.push('/checkout');
    }
    return (
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Items ({totalItem})</span>
                    <span className="text-lg font-semibold text-gray-800">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-800">
                        {shippingCost === 0 ? (
                            <span className="text-green-600">FREE</span>
                        ) : (
                            `$${shippingCost.toFixed(2)}`
                        )}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-semibold text-gray-800">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${finalAmount.toFixed(2)}</span>
                </div>
                {totalAmount > 100 && (
                    <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg text-center">
                        🎉 You've qualified for free shipping!
                    </p>
                )}
                <button 
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors mt-6 shadow-md hover:shadow-lg"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    )
}