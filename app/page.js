'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import BudgetSection from '@/components/home/BudgetSection';
import FeaturedDealsSection from '@/components/home/FeaturedDealsSection';
import PromoBanner from '@/components/home/PromoBanner';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <HeroSection />
        <CategorySection />
        <BudgetSection />
        <FeaturedDealsSection />
        <PromoBanner />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
