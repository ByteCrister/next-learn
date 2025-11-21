import HowToUse from '@/components/how-to-use/HowToUse';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Use - NextLearn Platform',
  description: 'Step-by-step guide to get started with Next-Learn. Learn how to create an account, navigate courses, track progress, and maximize your learning experience.',
  keywords: 'how to use next-learn, getting started guide, tutorial, learning platform guide, user guide',
  openGraph: {
    title: 'How to Use - Next-Learn Platform',
    description: 'Complete guide to getting started with Next-Learn platform',
    url: '/how-to-use',
    siteName: 'Next-Learn',
    images: [
      {
        url: '/og-how-to-use.jpg',
        width: 1200,
        height: 630,
        alt: 'How to Use Next-Learn',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Use - Next-Learn Platform',
    description: 'Step-by-step guide to get started with Next-Learn',
    images: ['/og-how-to-use.jpg'],
  },
  alternates: {
    canonical: '/how-to-use',
  },
};


const page = () => {
  return (
    <HowToUse />
  )
}

export default page