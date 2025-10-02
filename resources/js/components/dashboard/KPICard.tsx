import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Minus } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    unit?: string;
    status?: 'normal' | 'warning';
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    description?: string;
}

const KPICard = ({
    title = 'Metric',
    value = 0,
    unit = '',
    status = 'normal',
    trend = 'neutral',
    trendValue = '',
    description = '',
}: KPICardProps) => {
    const trendConfig = {
        up: { icon: ArrowUp, color: 'text-green-500', bg: 'bg-green-50' },
        down: { icon: ArrowDown, color: 'text-red-500', bg: 'bg-red-50' },
        neutral: { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-50' },
    };

    const statusConfig = {
        normal: { icon: CheckCircle2, color: 'text-green-500' },
        warning: { icon: AlertCircle, color: 'text-amber-500' },
    };

    const TrendIcon = trendConfig[trend].icon;
    const StatusIcon = statusConfig[status].icon;

    return (
        <Card className="group overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl">

            <CardContent className="relative p-6">
                {/* Status indicator bar */}
                <div className={`absolute top-0 left-0 h-1 w-full ${status === 'normal' ? 'bg-green-500' : 'bg-amber-500'}`} />

                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                        <h3 className="text-sm font-medium tracking-wider text-gray-500 uppercase">{title}</h3>
                        <StatusIcon className={`h-5 w-5 ${statusConfig[status].color}`} />
                    </div>

                    {/* Main Value */}
                    <div className="mb-2 flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">{value}</span>
                        {unit && <span className="mb-1 text-lg text-gray-500">{unit}</span>}
                    </div>

                    {/* Trend Indicator */}
                    {trendValue && (
                        <div className={`inline-flex items-center rounded-full px-2.5 py-1 ${trendConfig[trend].bg} mt-2 w-fit`}>
                            <TrendIcon className={`mr-1 h-4 w-4 ${trendConfig[trend].color}`} />
                            <span className={`text-xs font-medium ${trendConfig[trend].color}`}>
                                {trendValue} {trend === 'up' ? 'Increase' : trend === 'down' ? 'Decrease' : 'No change'}
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    {description && <p className="mt-4 text-sm text-gray-500">{description}</p>}
                </div>
            </CardContent>
        </Card>
    );
};

export default KPICard;
