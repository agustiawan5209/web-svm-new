import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
export default function HeroSection() {
    const { auth } = usePage<SharedData>().props;
    // Animation variants
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
        <div className="container mx-auto max-w-6xl">
            {/* Hero Section */}
            <motion.section variants={itemVariants} className="py-16 md:py-24">
                <div className="container mx-auto flex flex-col items-center px-4 md:flex-row">
                    <div className="mb-10 md:mb-0 md:w-1/2">
                        <h1 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
                            Sistem Deteksi Gizi Ibu Hamil dengan Algoritma SVM
                        </h1>
                        <p className="mb-8 text-lg text-gray-600">
                            Solusi modern untuk membantu tenaga kesehatan memantau dan mendeteksi status gizi ibu hamil dengan akurat menggunakan
                            teknologi machine learning.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Link href="/login">
                                <Button className="rounded-md bg-teal-500 px-8 py-3 text-white hover:bg-teal-600">Mulai Deteksi</Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" className="rounded-md border-teal-500 px-8 py-3 text-teal-500 hover:bg-teal-50">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex justify-center md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=800&q=80"
                            alt="Ibu Hamil"
                            className="h-auto max-w-full rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
