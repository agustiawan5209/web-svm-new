import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart2Icon,
    BarChart3,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock8,
    CopyIcon,
    FolderClockIcon,
    GalleryHorizontal,
    Home,
    PersonStanding,
    Users2,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
    className?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    handleSidebarIsMobile?: () => void;
}

const Sidebar = ({ className, collapsed = false, onToggleCollapse, handleSidebarIsMobile }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const activeSection = usePage().url.split('/').pop() || 'Dashboard';
    const { auth } = usePage<SharedData>().props;
    // console.log('Active Section:', activeSection);

    const handleToggleCollapse = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onToggleCollapse) {
            onToggleCollapse();
        }
    };

    const navItems = [
        { name: 'Dashboard', icon: <Home size={20} />, href: route('dashboard'), active: 'dashboard' },

        // Parent item dengan nested dropdown
        {
            name: 'Master Data',
            icon: <CopyIcon size={20} />,
            active: ['kriterias', 'pasien'],
            hasChildren: true,
            children: [
                { name: 'Kriteria', icon: <BarChart2Icon size={20} />, href: route('admin.kriteria.index'), active: 'kriterias' },
                { name: 'Data Pasien', icon: <Users2 size={20} />, href: route('pasien.index'), active: 'pasien' },
            ],
        },

        // Parent item dengan nested dropdown
        {
            name: 'Support Vector Machine',
            icon: <GalleryHorizontal size={20} />,
            active: ['model-storage', 'dataset'],
            hasChildren: true,
            children: [
                {
                    name: 'Dataset Gizi Ibu Hamil',
                    icon: <FolderClockIcon size={20} />,
                    href: route('admin.dataset.index'),
                    active: 'dataset',
                },
                // {
                //     name: 'Algoritma Support Vector Machine',
                //     icon: <Code size={20} />,
                //     href: route('ModelStorage.index'),
                //     active: 'model-storage',
                // },
            ],
        },

        { name: 'Pemeriksaan', icon: <Clock8 size={20} />, href: route('pemeriksaan.index'), active: 'pemeriksaan' },
        { name: 'Riwayat Pemeriksaan Pengguna', icon: <FolderClockIcon size={20} />, href: route('admin.riwayat.index'), active: 'riwayat-forest' },
    ];

    // State untuk mengontrol dropdown
    const [openDropdown, setOpenDropdown] = useState(null);

    // Fungsi untuk toggle dropdown
    const toggleDropdown = (itemName: any) => {
        setOpenDropdown(openDropdown === itemName ? null : itemName);
        console.log(itemName);
    };

    if (auth.role == 'super_admin') {
        navItems.push(
            { name: 'Label', icon: <BarChart2Icon size={20} />, href: route('admin.label.index'), active: 'label' },
            { name: 'Label Sayuran', icon: <BarChart3 size={20} />, href: route('admin.labelSayuran.index'), active: 'label-sayuran' },

            // { name: 'Jenis Sayuran', icon: <LeafyGreen size={20} />, href: route('admin.jenisTanaman.index'), active: 'jenis-tanaman' },
        );
    }

    const isMobile = useIsMobile();
    return (
        <div className={cn('flex h-full flex-col border-r bg-sidebar transition-all duration-300', isCollapsed ? 'w-16' : 'w-64', className)}>
            {/* Logo and collapse button */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <PersonStanding className="text-background" size={24} />
                    {!isCollapsed && <span className="text-lg font-semibold text-background">GiziIbu</span>}
                </div>
                {!isMobile ? (
                    <Button variant="ghost" size="icon" onClick={handleToggleCollapse} className="h-8 w-8">
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" onClick={handleSidebarIsMobile} className="h-8 w-8">
                        <X size={16} />
                    </Button>
                )}
            </div>

            <Separator />

            {/* Navigation */}
            <ScrollArea className="flex-1">
                <nav className="px-2 py-4">
                    <TooltipProvider delayDuration={0}>
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    {/* Jika item memiliki children (dropdown) */}
                                    {item.hasChildren ? (
                                        <div className="relative">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={item.active.includes(activeSection) ? 'outline' : 'ghost'}
                                                        className={cn('group w-full justify-start', isCollapsed ? 'px-2' : 'px-3')}
                                                        onClick={() => toggleDropdown(item.name)}
                                                    >
                                                        <span className="flex w-full items-center justify-between">
                                                            <span
                                                                className={cn(
                                                                    item.active.includes(activeSection) ? 'text-primary' : 'text-white',
                                                                    'flex items-center transition-colors',
                                                                )}
                                                            >
                                                                <span>{item.icon}</span>
                                                                {!isCollapsed && (
                                                                    <span className="ml-3 text-left whitespace-normal">{item.name}</span>
                                                                )}
                                                            </span>
                                                            {!isCollapsed && (
                                                                <ChevronDown
                                                                    size={16}
                                                                    className={cn(
                                                                        'text-background transition-transform',
                                                                        openDropdown === item.name ? 'rotate-180' : '',
                                                                    )}
                                                                />
                                                            )}
                                                        </span>
                                                    </Button>
                                                </TooltipTrigger>
                                                {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                                            </Tooltip>

                                            {/* Dropdown Menu */}
                                            {!isCollapsed && openDropdown === item.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <ul className="mt-1 ml-6 space-y-1 border-l-2 border-border pl-3">
                                                        {item.children.map((child) => (
                                                            <li key={child.name}>
                                                                <Link href={child.href}>
                                                                    <Button
                                                                        variant={child.active == activeSection ? 'outline' : 'ghost'}
                                                                        className={cn('w-full justify-start text-sm', 'h-auto px-3 py-1')}
                                                                    >
                                                                        <span className="flex items-center">
                                                                            <span
                                                                                className={cn(
                                                                                    child.active == activeSection
                                                                                        ? 'text-primary'
                                                                                        : 'text-muted-foreground',
                                                                                )}
                                                                            >
                                                                                {child.icon}
                                                                            </span>
                                                                            <span className="ml-2 text-left whitespace-normal">{child.name}</span>
                                                                        </span>
                                                                    </Button>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </div>
                                    ) : (
                                        // Item biasa (tanpa dropdown)
                                        <Link
                                            href={item.href as string}
                                            className={cn('flex items-center', item.active == activeSection ? 'text-primary' : 'text-white')}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={item.active == activeSection ? 'outline' : 'ghost'}
                                                        className={cn('w-full justify-start', isCollapsed ? 'px-2' : 'px-3')}
                                                    >
                                                        <span className="flex items-center">
                                                            <span className={cn(item.active == activeSection ? 'text-primary' : 'text-white')}>
                                                                {item.icon}
                                                            </span>
                                                            {!isCollapsed && <span className="ml-3 text-left whitespace-normal">{item.name}</span>}
                                                        </span>
                                                    </Button>
                                                </TooltipTrigger>
                                                {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                                            </Tooltip>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </TooltipProvider>
                </nav>
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
