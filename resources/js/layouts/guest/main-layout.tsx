import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toast } from '@/components/ui/toast';
import { UserInfo } from '@/components/user-info';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronsUpDown, FormInput, Home, LogOut, Menu, Settings, Sprout, TimerIcon, X } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
export default function MainLayout({ children }: PropsWithChildren) {
    const page = usePage<SharedData>();
    const { flash, auth } = page.props;
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [{ name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> }];
    const AuthNavItems = [
        { name: 'Home', path: route('guest.dashboard'), icon: <Home className="h-4 w-4" /> },
        { name: 'Biodata', path: route('guest.biodata.index'), icon: <Settings className="h-4 w-4" /> },
        { name: 'Mulai Pemeriksaan', path: route('guest.klasifikasi.create-id'), icon: <FormInput className="h-4 w-4" /> },
        { name: 'Riwayat Pemeriksaan', path: route('guest.klasifikasi.index'), icon: <TimerIcon className="h-4 w-4" /> },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    const isMobile = useIsMobile();
    return (
        <div className="min-h-screen bg-white to-blue-50">
            <Toast
                open={openToast}
                onOpenChange={setOpenToast}
                title={toastMessage.title}
                description={toastMessage.description}
                duration={5000}
                variant={toastMessage.variant}
            />

            {/* Header */}
            <motion.nav
                className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white"
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="flex items-center">
                                <Sprout className="h-8 w-8 text-green-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">NutriVege</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {auth.user
                                ? AuthNavItems.map((item) => {
                                      const isActive = location.pathname === item.path;
                                      return (
                                          <Link
                                              key={item.name}
                                              href={item.path}
                                              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                                  isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                              }`}
                                          >
                                              <span className="mr-1.5">{item.icon}</span>
                                              {item.name}
                                              {isActive && (
                                                  <motion.div
                                                      className="absolute bottom-0 left-0 h-0.5 w-full bg-green-600"
                                                      layoutId="navbar-indicator"
                                                  />
                                              )}
                                          </Link>
                                      );
                                  })
                                : navItems.map((item) => {
                                      const isActive = location.pathname === item.path;
                                      return (
                                          <Link
                                              key={item.name}
                                              href={'#' + item.path}
                                              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                                  isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                              }`}
                                          >
                                              <span className="mr-1.5">{item.icon}</span>
                                              {item.name}
                                              {isActive && (
                                                  <motion.div
                                                      className="absolute bottom-0 left-0 h-0.5 w-full bg-green-600"
                                                      layoutId="navbar-indicator"
                                                  />
                                              )}
                                          </Link>
                                      );
                                  })}
                        </div>

                        {/* User Profile */}
                        <div className="hidden items-center md:flex">
                            {auth.user ? (
                                <>
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
                                            <DropdownMenuLabel className="p-0 font-normal">
                                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                    <UserInfo user={auth.user} showEmail={true} />
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        className="block w-full"
                                                        href={route('profile.edit')}
                                                        as="button"
                                                        prefetch
                                                        onClick={cleanup}
                                                    >
                                                        <Settings className="mr-2" />
                                                        Settings
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    className="block w-full"
                                                    method="post"
                                                    href={route('logout')}
                                                    as="button"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="mr-2" />
                                                    Log out
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <div className="flex flex-row gap-3">
                                    <Link href={route('login')}>
                                        <Button type="button" variant={'default'}>
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button type="button" variant={'outline'}>
                                            Daftar
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none focus:ring-inset"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <motion.div
                    className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: isMenuOpen ? 1 : 0,
                        height: isMenuOpen ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="space-y-1 bg-white px-2 pt-2 pb-3 shadow-lg sm:px-3">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <a
                                    key={item.name}
                                    href={'#' + item.path}
                                    className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                                        isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </a>
                            );
                        })}
                        <div className="border-t border-gray-200 pt-4 pb-3">
                            {auth.user ? (
                                <>
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
                                            <DropdownMenuLabel className="p-0 font-normal">
                                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                    <UserInfo user={auth.user} showEmail={true} />
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    className="block w-full"
                                                    method="post"
                                                    href={route('logout')}
                                                    as="button"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="mr-2" />
                                                    Log out
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <div className="flex flex-row gap-3">
                                    <Link href={route('login')}>
                                        <Button type="button" variant={'default'}>
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button type="button" variant={'outline'}>
                                            Daftar
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.nav>

            {/* Content */}
            <main className="min-h-screen overflow-auto py-6 md:py-16">{children}</main>
            {/* Footer */}
            <footer className="bg-gray-900 px-4 py-12 text-white">
                <div className="container mx-auto">
                    <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 NutriVege. Semua hak dilindungi undang-undang.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
