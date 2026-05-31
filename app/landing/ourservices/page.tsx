import type { Metadata } from 'next';
import OurServices from '@/components/landing/OurServices';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Explore our maritime technology services including fleet management, analytics, and vessel monitoring.',
};

export default function ServicesPage() {
  return <OurServices />;
}