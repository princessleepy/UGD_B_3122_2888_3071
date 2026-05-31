import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Halaman login PT. Samudra Technology Nusantara',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}