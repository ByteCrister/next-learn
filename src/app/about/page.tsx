import About from '@/components/about/About';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About - NextLearn Platform',
    description:
        'Learn about NextLearn mission, vision, and our commitment to making quality education accessible to everyone through innovative technology.',
    keywords:
        'nextlearn, NextLearn, about nextlearn, education mission, learning platform, educational technology, online learning',

    openGraph: {
        title: 'About - NextLearn Platform',
        description: 'Discover our mission to make quality education accessible to everyone',
        url: 'https://next-learn-nu-olive.vercel.app/about',
        siteName: 'NextLearn',
        images: [
            {
                url: 'https://next-learn-nu-olive.vercel.app/og-about.jpg',
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
        description:
            'Learn about Next-Learn mission and commitment to accessible education',
        images: ['https://next-learn-nu-olive.vercel.app/og-about.jpg'],
    },

    alternates: {
        canonical: 'https://next-learn-nu-olive.vercel.app/about',
    },
};

const page = () => {
    return <About />;
};

export default page;
