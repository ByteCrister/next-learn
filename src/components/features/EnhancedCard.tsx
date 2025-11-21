import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface EnhancedCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    gradient?: string;
}

export default function EnhancedCard({
    title,
    description,
    children,
    gradient
}: EnhancedCardProps) {
    return (
        <motion.div
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative group"
        >
            {/* Gradient border on hover */}
            <div className="absolute inset-0 rounded-2xl  opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <Card className={`h-full border-2 border-white/20 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl ${gradient ? `bg-gradient-to-br ${gradient}` : ''}`}>
                {/* Inset highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50" />
                <CardHeader className="pb-6 pt-8">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</CardTitle>
                    {description && <CardDescription className="text-lg text-muted-foreground">{description}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-6">
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );
}
