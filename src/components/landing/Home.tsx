import CTASection from "./CTASection"
import DemoSection from "./DemoSection"
import FeaturesSection from "./FeaturesSection"
import HeroSection from "./HeroSection"
import HowItWorksSection from "./HowItWorksSection"
import ValuePropositionSection from "./ValuePropositionSection"

const Home = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <ValuePropositionSection />
            <DemoSection />
            <CTASection />
        </div>
    )
}

export default Home