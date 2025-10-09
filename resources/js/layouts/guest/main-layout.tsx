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
import { AnimatePresence, motion } from 'framer-motion';
import { Baby, ChevronsUpDown, ClipboardList, Home, LogOut, Menu, Settings, Stethoscope, X } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function MainLayout({ children }: PropsWithChildren) {
    const page = usePage<SharedData>();
    const { flash, auth } = page.props;
    const [openToast, setOpenToast] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [toastMessage, setToastMessage] = useState({
        title: '',
        description: '',
        variant: 'success' as 'success' | 'error',
    });

    useEffect(() => {
        if (flash.success || flash.error) {
            setOpenToast(true);
        }
        if (flash.success) {
            setToastMessage({
                title: 'Berhasil',
                description: flash.success,
                variant: 'success',
            });
        }
        if (flash.error) {
            setToastMessage({
                title: 'Terjadi Kesalahan',
                description: flash.error,
                variant: 'error',
            });
        }
    }, [flash]);

    // Navigation items for authenticated users
    const AuthNavItems = [
        {
            name: 'Dashboard',
            path: route('guest.dashboard'),
            icon: <Home className="h-4 w-4" />,
            description: 'Overview sistem',
        },
        {
            name: 'Pemeriksaan',
            path: route('guest.klasifikasi.create-id'),
            icon: <Stethoscope className="h-4 w-4" />,
            description: 'Input data gizi',
        },
        {
            name: 'Riwayat',
            path: route('guest.klasifikasi.index'),
            icon: <ClipboardList className="h-4 w-4" />,
            description: 'Histori pemeriksaan',
        },
        // {
        //     name: 'Monitoring',
        //     path: route('guest.monitoring'),
        //     icon: <BarChart3 className="h-4 w-4" />,
        //     description: 'Pantau perkembangan',
        // },
        // {
        //     name: 'Laporan',
        //     path: route('guest.laporan'),
        //     icon: <FileText className="h-4 w-4" />,
        //     description: 'Analisis & report',
        // },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const cleanup = useMobileNavigation();
    const isMobile = useIsMobile();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const getCurrentGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 19) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
            <Toast
                open={openToast}
                onOpenChange={setOpenToast}
                title={toastMessage.title}
                description={toastMessage.description}
                duration={5000}
                variant={toastMessage.variant}
            />

            {/* Enhanced Header */}
            <motion.nav
                className="fixed top-0 right-0 left-0 z-50 border-b border-cyan-200/50 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo Section */}
                        <motion.div
                            className="flex flex-shrink-0 items-center"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 5, 0, -5, 0],
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            repeatDelay: 5,
                                        }}
                                    >
                                        <Baby className="h-10 w-10 text-cyan-600" />
                                    </motion.div>
                                    <motion.div
                                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
                                        NutriMaternal
                                    </span>
                                    <span className="-mt-1 text-xs text-gray-500">Sistem Klasifikasi Gizi Ibu Hamil</span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-1">
                            {auth.user ? (
                                AuthNavItems.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={item.path}
                                                className={`group relative flex flex-col items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/25'
                                                        : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className={`transition-transform duration-200 group-hover:scale-110 ${
                                                            isActive ? 'text-white' : 'text-cyan-600'
                                                        }`}
                                                    >
                                                        {item.icon}
                                                    </span>
                                                    <span>{item.name}</span>
                                                </div>
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-white"
                                                        layoutId="navbar-indicator"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link href="/">
                                        <Button variant="ghost" className="text-gray-600 hover:bg-cyan-50 hover:text-cyan-700">
                                            <Home className="mr-2 h-4 w-4" />
                                            Beranda
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* User Profile Section */}
                        <div className="hidden items-center space-x-4 lg:flex">
                            {auth.user ? (
                                <>
                                    {/* Welcome Message */}
                                    <motion.div
                                        className="hidden text-right xl:block"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <p className="text-sm font-medium text-gray-900">{getCurrentGreeting()}</p>
                                        <p className="text-xs text-gray-500">{auth.user.name}</p>
                                    </motion.div>

                                    {/* User Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <motion.div
                                                className="group flex items-center gap-3 rounded-xl border border-cyan-200 bg-white/50 p-2 text-sidebar-accent-foreground transition-all duration-200 hover:bg-cyan-50 hover:shadow-md data-[state=open]:bg-cyan-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <UserInfo user={auth.user} />
                                                <ChevronsUpDown className="h-4 w-4 text-cyan-600 transition-transform group-hover:rotate-180" />
                                            </motion.div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-64 rounded-xl border border-cyan-200 bg-white/95 p-2 shadow-xl backdrop-blur-lg"
                                            align="end"
                                            sideOffset={8}
                                        >
                                            <DropdownMenuLabel className="p-0 font-normal">
                                                <div className="flex items-center gap-3 px-2 py-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
                                                        <span className="text-sm font-semibold">
                                                            {auth.user.name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900">{auth.user.name}</span>
                                                        <span className="text-xs text-gray-500">{auth.user.email}</span>
                                                    </div>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-cyan-200/50" />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        className="flex w-full items-center rounded-lg px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-700"
                                                        href={route('profile.edit')}
                                                        as="button"
                                                        prefetch
                                                        onClick={cleanup}
                                                    >
                                                        <Settings className="mr-3 h-4 w-4" />
                                                        Pengaturan Akun
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator className="bg-cyan-200/50" />
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    className="flex w-full items-center rounded-lg px-2 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                                                    method="post"
                                                    href={route('logout')}
                                                    as="button"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="mr-3 h-4 w-4" />
                                                    Keluar
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <motion.div
                                    className="flex flex-row gap-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Link href={route('login')}>
                                        <Button variant="outline" className="border-cyan-300 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-50">
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="bg-gradient-to-r from-cyan-600 to-emerald-600 shadow-lg shadow-cyan-500/25 hover:from-cyan-700 hover:to-emerald-700">
                                            Daftar
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center lg:hidden">
                            <motion.button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-cyan-50 hover:text-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none focus:ring-inset"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="absolute top-full right-0 left-0 border-b border-cyan-200/50 bg-white/95 shadow-xl backdrop-blur-lg lg:hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                                transition: { duration: 0.3, ease: 'easeOut' },
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                                transition: { duration: 0.2, ease: 'easeIn' },
                            }}
                        >
                            <div className="space-y-2 px-4 pt-4 pb-6">
                                {auth.user ? (
                                    <>
                                        {/* User Info in Mobile */}
                                        <div className="mb-4 flex items-center space-x-3 rounded-lg bg-cyan-50/50 p-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
                                                <span className="text-sm font-semibold">
                                                    {auth.user.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">{auth.user.name}</span>
                                                <span className="text-xs text-cyan-600">{getCurrentGreeting()}</span>
                                            </div>
                                        </div>

                                        {/* Mobile Navigation Items */}
                                        {AuthNavItems.map((item, index) => {
                                            const isActive = location.pathname === item.path;
                                            return (
                                                <motion.div
                                                    key={item.name}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Link
                                                        href={item.path}
                                                        className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                                                            isActive
                                                                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg'
                                                                : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700'
                                                        }`}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <span
                                                            className={`transition-transform duration-200 ${
                                                                isActive ? 'text-white' : 'text-cyan-600'
                                                            }`}
                                                        >
                                                            {item.icon}
                                                        </span>
                                                        <div className="flex flex-col">
                                                            <span>{item.name}</span>
                                                            <span className="text-xs opacity-70">{item.description}</span>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}

                                        {/* Mobile User Actions */}
                                        <div className="mt-4 space-y-2 border-t border-cyan-200/50 pt-4">
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center space-x-3 rounded-xl px-4 py-3 text-base text-gray-600 transition-colors hover:bg-cyan-50 hover:text-cyan-700"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Settings className="h-4 w-4" />
                                                <span>Pengaturan</span>
                                            </Link>
                                            <Link
                                                method="post"
                                                href={route('logout')}
                                                className="flex items-center space-x-3 rounded-xl px-4 py-3 text-base text-rose-600 transition-colors hover:bg-rose-50"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    handleLogout();
                                                }}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Keluar</span>
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <Link href="/">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Home className="mr-3 h-4 w-4" />
                                                Beranda
                                            </Button>
                                        </Link>
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <Link href={route('login')}>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Masuk
                                                </Button>
                                            </Link>
                                            <Link href={route('register')}>
                                                <Button
                                                    className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Daftar
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Main Content with Enhanced Padding */}
            <main className="min-h-screen overflow-auto pt-20 lg:pt-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    {children}
                </motion.div>
            </main>

            {/* Enhanced Footer */}
            <motion.footer
                className="bg-gradient-to-r from-cyan-900 to-emerald-900 px-4 py-12 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <div className="mb-4 flex items-center space-x-3">
                                <Baby className="h-8 w-8 text-cyan-300" />
                                <span className="text-2xl font-bold text-white">NutriMaternal</span>
                            </div>
                            <p className="max-w-md text-sm text-cyan-100">
                                Sistem Klasifikasi Gizi Ibu Hamil yang komprehensif untuk memantau dan meningkatkan kesehatan ibu dan janin melalui
                                manajemen gizi yang optimal.
                            </p>
                        </div>

                        <div>
                            <h4 className="mb-4 font-semibold text-cyan-300">Navigasi</h4>
                            <ul className="space-y-2 text-sm text-cyan-100">
                                <li>
                                    <Link href="/" className="transition-colors hover:text-white">
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tentang" className="transition-colors hover:text-white">
                                        Tentang
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/bantuan" className="transition-colors hover:text-white">
                                        Bantuan
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 font-semibold text-cyan-300">Kontak</h4>
                            <ul className="space-y-2 text-sm text-cyan-100">
                                <li>Email: info@nutrimaternal.id</li>
                                <li>Telepon: (021) 1234-5678</li>
                                <li>Emergency: 24/7 Support</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-cyan-700 pt-8 text-center">
                        <p className="text-sm text-cyan-200">
                            &copy; 2024 NutriMaternal - Sistem Klasifikasi Gizi Ibu Hamil. Semua hak dilindungi undang-undang.
                        </p>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}
