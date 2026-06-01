// app/lib/metadata.ts
import type { Metadata } from 'next';

type PageMeta = {
  title: string;
  description?: string;
  keywords?: string[];
};

export function generatePageMetadata({ title, description, keywords }: PageMeta): Metadata {
  const baseTitle = 'PT. Samudra Technology Nusantara';
  const baseDescription = 'Maritime Analytics & Fleet Management System';
  
  return {
    title: `${title} | ${baseTitle}`,
    description: description || baseDescription,
    keywords: keywords || ['maritime', 'fleet management', 'analytics', 'shipping'],
    // Open Graph untuk social sharing
    openGraph: {
      title: `${title} | ${baseTitle}`,
      description: description || baseDescription,
      type: 'website',
    },
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${baseTitle}`,
      description: description || baseDescription,
    },
  };
}