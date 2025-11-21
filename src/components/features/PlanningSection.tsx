import { fadeUp } from "./motion-variants";
import SectionHeading from "./SectionHeading";
import EnhancedCard from "./EnhancedCard";
import RoutineBuilder from "./RoutineBuilder";
import MiniCalendar from "./MiniCalendar";
import FeatureList from "./FeatureList";
import DashboardPreview from "./DashboardPreview";
import { Calendar } from 'lucide-react';
import { Brain } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';
import { Zap } from 'lucide-react';
export default function PlanningSection() {
    return (
        <section {...fadeUp} className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <SectionHeading
                icon={<Calendar className="w-10 h-10" />}
                title="Planning & organization"
                subtitle="Create study routines, manage events on a visual calendar, and receive intelligent reminders that adapt to your schedule."
            />

            <div className="grid md:grid-cols-2 gap-8">
                <EnhancedCard
                    title="Study routines"
                    description="Build consistent learning habits with recurring schedules"
                    gradient="from-orange-500/10 to-red-500/10"
                >
                    <RoutineBuilder />
                </EnhancedCard>

                <EnhancedCard
                    title="Smart calendar"
                    description="Visual planning with conflict detection and priority management"
                    gradient="from-blue-500/10 to-indigo-500/10"
                >
                    <MiniCalendar />
                </EnhancedCard>

                <EnhancedCard
                    title="Intelligent reminders"
                    description="Context-aware notifications that respect your focus time"
                    gradient="from-purple-500/10 to-pink-500/10"
                >
                    <FeatureList
                        items={[
                            { label: "Adaptive timing", detail: "Learns your peak focus hours", icon: <Brain /> },
                            { label: "Zero conflicts", detail: "Automatically avoids overlaps", icon: <CircleCheckBig /> },
                            { label: "Priority-aware", detail: "Highlights urgent tasks first", icon: <Zap /> },
                        ]}
                    />
                </EnhancedCard>

                <EnhancedCard
                    title="Visual dashboard"
                    description="Beautiful overview of all your learning activities"
                    gradient="from-green-500/10 to-teal-500/10"
                >
                    <DashboardPreview />
                </EnhancedCard>
            </div>
        </section>
    );
}
