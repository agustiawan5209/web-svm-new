// components/stat-card.tsx
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
    trend?: { value: number; isPositive: boolean };
    color: 'blue' | 'emerald' | 'amber' | 'green' | 'red';
}

export function StatCard({ icon, title, value, description, trend, color }: StatCardProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-cyan-500',
        emerald: 'from-emerald-500 to-green-500',
        amber: 'from-amber-500 to-orange-500',
        green: 'from-green-500 to-emerald-500',
        red: 'from-red-500 to-rose-500',
    };

    return (
        <motion.div whileHover={{ scale: 1.02 }} className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm opacity-90">{title}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                    <p className="mt-1 text-sm opacity-80">{description}</p>
                </div>
                <div className="rounded-lg bg-white/20 p-2">{icon}</div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className={`mr-1 h-4 w-4 ${trend.isPositive ? 'text-green-300' : 'text-red-300'}`} />
                    <span>{trend.value}% dari bulan lalu</span>
                </div>
            )}
        </motion.div>
    );
}
