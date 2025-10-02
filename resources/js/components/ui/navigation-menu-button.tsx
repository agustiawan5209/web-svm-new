import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { cva } from "class-variance-authority";

const NavigationButtons = ({
    title,
    href,
    isActive,
    variant = 'default',
    size = 'sm',
    icon: Icon,
    className = '',
}: {
    title: string;
    isActive: boolean;
    variant: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    href: string;
    icon: React.ComponentType;
    className?: string;
}) => {
    return (
        <Link href={href} data-slot="sidebar-menu-button" data-sidebar="menu-button" data-active={isActive}>
            <div
                className={cn(
                    sidebarMenuButtonVariants({ variant, size }),
                    className,
                    // Modern UI enhancements
                    'transition-all duration-200 ease-in-out',
                    'rounded-xl shadow-sm',
                    isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow',
                )}
            >
                {Icon && <Icon />}
                <span className="truncate font-medium tracking-wide">{title}</span>
            </div>
        </Link>
    );
};

const sidebarMenuButtonVariants = cva(
    'flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-2 text-left text-base outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: '',
                outline: 'bg-background border border-sidebar-border shadow hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            },
            size: {
                default: 'h-10 text-base',
                sm: 'h-9 text-sm',
                lg: 'h-12 text-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);
export { NavigationButtons, sidebarMenuButtonVariants };
