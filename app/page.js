import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';


export default function Home() {
  return (
    <>
      <Header />
      <main>
        <h1>Welcome to ShopCRM</h1>
        <p>Your one-stop shop for all your online shopping needs.</p>
        <Link href="/products">Browse Products</Link>
      </main> 
      <Footer />

    </>
  )
} 