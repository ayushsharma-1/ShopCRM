import Link from 'next/link';

export default function Footer() {
    return (
        <footer>
            <div>
                <p>&copy; {new Date().getFullYear()} ShopCRM. All rights reserved.</p>
                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/products">Products</Link>
                    <Link href="/cart">Cart</Link>
                </nav>
            </div>
        </footer>
    );
}