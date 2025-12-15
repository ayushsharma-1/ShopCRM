import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/redux/slices/cartSlice';
import Button from '../common/button';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const { id, name, description, price, image } = product;
    const handleAddToCart = () => {
        dispatch(addToCart({ id, title: name, name, price, image, quantity: 1 }));
    }
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <Link href={`/products/${id}`}>
                <img src={image} alt={name} className="w-full h-48 object-cover mb-4 rounded" />
                <h2 className="text-xl font-semibold mb-2">{name}</h2>
            </Link>
            <p className="text-gray-700 mb-4">{description}</p>
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold">${price.toFixed(2)}</span>
                <Button onClick={handleAddToCart}>Add to Cart</Button>
            </div>
        </div>
    );
}
