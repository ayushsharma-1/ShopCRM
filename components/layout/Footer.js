import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-blue-400 mb-4">ShopCRM</h3>
                        <p className="text-gray-400">Your one-stop shop for all your online shopping needs.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <nav className="space-y-2">
                            <Link href="/" className="block text-gray-400 hover:text-blue-400 transition-colors">
                                Home
                            </Link>
                            <Link href="/products" className="block text-gray-400 hover:text-blue-400 transition-colors">
                                Products
                            </Link>
                            <Link href="/cart" className="block text-gray-400 hover:text-blue-400 transition-colors">
                                Cart
                            </Link>
                        </nav>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <div className="space-y-2 text-gray-400">
                            <p>Email: support@shopcrm.com</p>
                            <p>Phone: (555) 123-4567</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} ShopCRM. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}