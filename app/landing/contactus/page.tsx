import type { Metadata } from 'next';
import ContactUs from '@/components/landing/ContactUs';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with PT. Samudra Technology Nusantara for maritime technology solutions and partnerships.',
};

export default function ContactPage() {
  return <ContactUs />;
}