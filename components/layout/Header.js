"use client";

import Link from 'next/link';
import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const Logo = () => (
    <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
        ShopCRM
    </Link>
);

const NavLink = ({ href, children }) => (
    <Link 
        href={href} 
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
    >
        {children}
    </Link>
);

const CartButton = () => {
    const router = useRouter();
    const cartItems = useSelector((state) => state.cart.items);
    const totalItems = useSelector((state) => state.cart.totalItem);
    
    return (
        <button 
            onClick={() => router.push('/cart')}
            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                </span>
            )}
        </button>
    );
}

export default function Header() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
            scrolled ? 'shadow-md' : 'shadow-sm'
        }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Logo />
                    <nav className="hidden md:flex items-center space-x-1">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/products">Products</NavLink>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <CartButton />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <nav className="md:hidden py-4 space-y-2 border-t border-gray-200">
                        <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                            Home
                        </Link>
                        <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                            Products
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}