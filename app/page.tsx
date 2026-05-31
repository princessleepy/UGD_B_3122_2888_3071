import type { Metadata } from 'next';
import HeroSection from '@/components/landing/HeroSection';

export const metadata: Metadata = {
  title: 'PT. Samudra Technology Nusantara',
  description:
    'Pioneering Digital Maritime Solutions Across Southeast Asia.',
};

export default function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}