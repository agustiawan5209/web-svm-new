import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Side - Hero Section */}
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-primary to-secondary p-10 lg:flex dark:from-pink-900/20 dark:to-rose-900/20">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-rose-500/10" />

                <div className="relative container mx-auto flex h-full flex-col justify-center">
                    <motion.div
                        className="flex flex-col items-center gap-8 md:flex-row"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="flex-1" variants={itemVariants}>
                            <h1 className="mb-6 text-center text-2xl font-bold text-white md:text-4xl lg:text-5xl">
                                Sistem Deteksi Gizi Ibu Hamil dengan Algoritma SVM
                            </h1>
                            <p className="mb-8 text-justify text-lg leading-relaxed text-yellow-400">
                                Sistem pintar yang menggunakan <span className="font-semibold text-white">Support Vector Machine (SVM)</span>
                                untuk mendeteksi status gizi ibu hamil secara akurat. Membantu tenaga medis dan ibu hamil dalam memantau kondisi gizi
                                selama masa kehamilan.
                            </p>

                            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-lg bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-rose-900/30">
                                    <div className="text-2xl font-bold text-white">99%</div>
                                    <div className="text-sm text-yellow-400">Akurasi</div>
                                </div>
                                <div className="rounded-lg bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-rose-900/30">
                                    <div className="text-2xl font-bold text-white">SVM</div>
                                    <div className="text-sm text-yellow-400">Algoritma</div>
                                </div>
                                <div className="rounded-lg bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-rose-900/30">
                                    <div className="text-2xl font-bold text-white">Real-time</div>
                                    <div className="text-sm text-yellow-400">Deteksi</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Features List */}
                    <motion.div
                        className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="flex items-start gap-3" variants={itemVariants}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-white dark:bg-white">✓</div>
                            <div>
                                <h3 className="font-semibold text-white">Deteksi Cepat</h3>
                                <p className="text-sm text-white">Analisis data gizi dalam hitungan detik</p>
                            </div>
                        </motion.div>

                        <motion.div className="flex items-start gap-3" variants={itemVariants}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-white dark:bg-white">✓</div>
                            <div>
                                <h3 className="font-semibold text-white">Akurat</h3>
                                <p className="text-sm text-white">Menggunakan algoritma SVM terbaik</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2 rounded-lg bg-white/30 p-4 backdrop-blur-sm dark:bg-rose-900/30">
                            <p className="text-lg text-white">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm text-white">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    {/* Mobile Logo */}
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <div className="flex flex-col items-center">
                            <AppLogoIcon className="h-12 fill-current text-white sm:h-14" />
                            <span className="mt-2 text-sm font-semibold text-white">Deteksi Gizi Ibu Hamil</span>
                        </div>
                    </Link>

                    {/* Auth Header */}
                    <div className="flex flex-col items-start gap-3 text-left sm:items-center sm:text-center">
                        <div className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-white dark:bg-rose-900/30">SVM Algorithm</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">{description}</p>
                    </div>

                    {/* Auth Content */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {children}
                    </motion.div>

                    {/* Footer Note */}
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            Sistem deteksi gizi menggunakan <span className="font-medium text-white">Support Vector Machine</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
