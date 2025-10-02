import { AlignJustify } from 'lucide-react';
// Import the default export from each file
import { Breadcrumbs } from '@/components/breadcrumbs';
import Sidebar from '@/components/dashboard/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Toast } from '@/components/ui/toast';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState, type PropsWithChildren } from 'react';
export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const page = usePage<SharedData>();
    const { flash, auth } = page.props;
    const getInitials = useInitials();
    const [openToast, setOpenToast] = useState(false);

    const [toastMessage, setToastMessage] = useState({
        title: '',
        description: '',
        variant: 'success' as 'success' | 'error',
    });

    useEffect(() => {
        if (flash.success || flash.error) {
            // If there's a flash message, open the toast
            setOpenToast(true);
        }
        if (flash.success) {
            // If there's a success message, set the toast message
            setToastMessage({
                title: 'Success',
                description: flash.success,
                variant: 'success',
            });
        }
        if (flash.error) {
            // If there's an error message, set the toast message
            setToastMessage({
                title: 'Error',
                description: flash.error,
                variant: 'error',
            });
        }
    }, [flash]);

    const isMobile = useIsMobile();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    const closeSidebar = () => {
        setSidebarOpen(false);
    };
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Toast
                open={openToast}
                onOpenChange={setOpenToast}
                title={toastMessage.title}
                description={toastMessage.description}
                duration={5000}
                variant={toastMessage.variant}
            />

            {/* Sidebar */}
            {!isMobile && <Sidebar collapsed={false} />}

            {isMobile && sidebarOpen && (
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ duration: 0.3 }} className="fixed z-50 w-full bg-sidebar">
                    <Sidebar collapsed={false} className="w-full" handleSidebarIsMobile={closeSidebar} />
                </motion.div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-sidebar-border/50 bg-background px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Button type="button" variant={'ghost'} onClick={() => setSidebarOpen(true)} className={'md:hidden'}>
                            <AlignJustify className="h-6 w-6" />
                        </Button>
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-10 rounded-full p-1">
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <section className="max-w-full flex-1 overflow-auto p-4 md:p-6">{children}</section>
            </main>
        </div>
    );
}
