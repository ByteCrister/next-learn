import { fadeUp } from "./motion-variants";
import SectionHeading from "./SectionHeading";
import SharingCard from "./SharingCard";
import { Share } from 'lucide-react';
import { Link } from 'lucide-react';
import { Globe } from 'lucide-react';
import { PartyPopper } from 'lucide-react';

export default function SharingSection() {
    return (
        <section {...fadeUp} className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SectionHeading
                icon={<Share className="w-10 h-10" />}
                title="Sharing & discovery"
                subtitle="Share your knowledge with the community, explore curated content, and celebrate achievements together."
            />

            <div className="grid md:grid-cols-3 gap-6">
                <SharingCard
                    icon={<Link className="w-10 h-10" />}
                    title="One-click sharing"
                    description="Generate beautiful shareable links for any content"
                    action="Copy Link"
                />
                <SharingCard
                    icon={<Globe className="w-10 h-10" />}
                    title="Public library"
                    description="Explore roadmaps and notes from top learners"
                    action="Browse"
                />
                <SharingCard
                    icon={<PartyPopper className="w-10 h-10" />}
                    title="Social integrations"
                    description="Share achievements across all platforms"
                    action="Connect"
                />
            </div>
        </section>
    );
}
