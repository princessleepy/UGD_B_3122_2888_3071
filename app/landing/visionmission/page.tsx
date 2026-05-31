import type { Metadata } from 'next';
import VisionMission from '@/components/landing/VisionMission';

export const metadata: Metadata = {
  title: 'Vision & Mission',
  description:
    'Vision and mission of PT. Samudra Technology Nusantara in advancing digital maritime solutions.',
};

export default function VisionMissionPage() {
  return <VisionMission />;
}