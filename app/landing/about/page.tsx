import type { Metadata } from 'next';
import AboutSection from '@/components/landing/AboutSection';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn more about PT. Samudra Technology Nusantara and our commitment to delivering innovative maritime technology solutions.',
};

export default function AboutPage() {
  return <AboutSection />;
}