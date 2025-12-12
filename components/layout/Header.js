"use client";

import Link from 'next/link';
import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const Logo = () => (<Link href="/">ShopCRM</Link>);

const NavLink = ({ href, children }) => (
    <Link href={href}>{children}</Link>
);

const CartButton = () => {
    const cartItems = useSelector((state) => state.cart.items);
    return (
        <button>
            <div>
                <span>{cartItems.length}</span>
            </div>
        </button>
    );
}

export default function Header() {
    // const dispatch = useDispatch();
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
        <header>
            <div>
                <div>
                    <Logo />
                    <nav>
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/products">Products</NavLink>
                    </nav>
                    <div>
                        <CartButton />
                        <div></div> {/* userMenu placeholder */}
                        <button>
                            <div></div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )

}