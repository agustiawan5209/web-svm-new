import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3 } from 'lucide-react';
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
            <motion.div className="flex flex-col items-center gap-12 md:flex-row" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div className="flex-1" variants={itemVariants}>
                    <h1 className="mb-6 text-3xl font-bold text-primary md:text-5xl">Rekomendasi Makanan Bergizi untuk Ibu Hamil</h1>
                    <p className="mb-8 text-lg text-muted-foreground">
                        Sistem cerdas menggunakan algoritma decision tree untuk membantu orang tua merekomendasikan sayuran untuk anak berdasarkan
                        kondisi kesehatannya
                    </p>
                    {!auth.user && (
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" asChild>
                                <Link href={route('login')}>
                                    Mulai Rekomendasi <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/login" className="text-primary">
                                    Lihat Dashboard <BarChart3 className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </motion.div>

                <motion.div className="flex flex-1 justify-center" variants={itemVariants}>
                    <img
                        src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80"
                        alt="Vegetables for children"
                        className="h-auto max-w-full rounded-lg shadow-xl"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
