import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="group flex items-center gap-2 rounded-md p-2 text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent">
                    <UserInfo user={auth.user} />
                    <ChevronsUpDown className="ml-auto size-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                side={isMobile ? 'bottom' : 'bottom'}
            >
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
