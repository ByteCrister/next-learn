import About from '@/components/about/About';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - NextLearn Platform',
    description: 'Learn about Next-Learn mission, vision, and our commitment to making quality education accessible to everyone through innovative technology.',
    keywords: 'about next-learn, education mission, learning platform, educational technology, online learning',
    openGraph: {
        title: 'About Us - Next-Learn Platform',
        description: 'Discover our mission to make quality education accessible to everyone',
        url: '/about',
        siteName: 'NextLearn',
        images: [
            {
                url: '/og-about.jpg',
                width: 1200,
                height: 630,
                alt: 'About NextLearn',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us - NextLearn Platform',
        description: 'Learn about Next-Learn mission and commitment to accessible education',
        images: ['/og-about.jpg'],
    },
    alternates: {
        canonical: '/about',
    },
};


const page = () => {
    return (
        <About />
    )
}

export default page