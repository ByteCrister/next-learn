import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Next-Learn Platform',
  description: 'Learn about Next-Learn mission, vision, and our commitment to making quality education accessible to everyone through innovative technology.',
  keywords: 'about next-learn, education mission, learning platform, educational technology, online learning',
  openGraph: {
    title: 'About Us - Next-Learn Platform',
    description: 'Discover our mission to make quality education accessible to everyone',
    url: '/about',
    siteName: 'Next-Learn',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'About Next-Learn',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Next-Learn Platform',
    description: 'Learn about Next-Learn mission and commitment to accessible education',
    images: ['/og-about.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const team = [
    {
      name: "Education Team",
      role: "Curriculum Design",
      description: "Experts in creating engaging and effective learning content"
    },
    {
      name: "Technology Team",
      role: "Platform Development",
      description: "Innovators building cutting-edge educational technology"
    },
    {
      name: "Support Team",
      role: "Student Success",
      description: "Dedicated to helping learners achieve their goals"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Next-Learn
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering learners worldwide through innovative educational technology and personalized learning experiences.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To make quality education accessible to everyone, regardless of their background or location. We believe that learning should be personalized, engaging, and effective.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Through innovative technology and expert-designed content, we're breaking down barriers to education and creating opportunities for lifelong learning.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A world where every individual has the tools and resources they need to achieve their educational goals and unlock their full potential.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We envision a future where learning is not limited by geography, economics, or traditional constraints, but is enhanced by technology and human connection.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Accessibility", description: "Making education available to everyone" },
              { title: "Innovation", description: "Constantly improving through technology" },
              { title: "Excellence", description: "Maintaining high standards in everything we do" },
              { title: "Community", description: "Building supportive learning environments" },
              { title: "Personalization", description: "Tailoring experiences to individual needs" },
              { title: "Growth", description: "Fostering continuous learning and development" }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
