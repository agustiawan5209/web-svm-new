import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <header className="bg-white py-4 shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-8 w-8 text-teal-500"
                        >
                            <path d="M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                            <path d="M12 13a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8z" />
                        </svg>
                        <h1 className="text-xl font-semibold text-gray-800">SisGizi Ibu Hamil</h1>
                    </div>
                    <nav className="hidden space-x-6 md:flex">
                        <a href="#features" className="text-gray-600 transition-colors hover:text-teal-500">
                            Fitur
                        </a>
                        <a href="#about" className="text-gray-600 transition-colors hover:text-teal-500">
                            Tentang
                        </a>
                        <a href="#contact" className="text-gray-600 transition-colors hover:text-teal-500">
                            Kontak
                        </a>
                    </nav>
                    <Link href="/login">
                        <Button variant="outline" className="hidden border-teal-500 text-teal-500 hover:bg-teal-50 md:inline-flex">
                            Login
                        </Button>
                    </Link>
                    <button className="text-gray-600 md:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 md:py-24">
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
            </section>

            {/* Features Section */}
            <section id="features" className="bg-blue-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">Fitur Utama</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <Card className="border-none bg-white shadow-md transition-shadow hover:shadow-lg">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-teal-100 p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-teal-500"
                                    >
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">Deteksi Akurat</h3>
                                <p className="text-gray-600">
                                    Menggunakan algoritma Support Vector Machine (SVM) untuk hasil deteksi gizi yang akurat dan terpercaya.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none bg-white shadow-md transition-shadow hover:shadow-lg">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-teal-100 p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-teal-500"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="3" y1="9" x2="21" y2="9"></line>
                                        <line x1="9" y1="21" x2="9" y2="9"></line>
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">Dashboard Informatif</h3>
                                <p className="text-gray-600">
                                    Visualisasi data yang mudah dipahami dengan grafik dan tabel untuk memantau perkembangan gizi.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none bg-white shadow-md transition-shadow hover:shadow-lg">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-teal-100 p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-teal-500"
                                    >
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">Manajemen Data</h3>
                                <p className="text-gray-600">Kelola data ibu hamil dengan mudah dan aman untuk pemantauan berkelanjutan.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center md:flex-row">
                        <div className="mb-10 md:mb-0 md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                                alt="Tenaga Kesehatan"
                                className="h-auto max-w-full rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="md:w-1/2 md:pl-12">
                            <h2 className="mb-6 text-3xl font-bold text-gray-800">Tentang Sistem Kami</h2>
                            <p className="mb-6 text-lg text-gray-600">
                                Sistem Deteksi Gizi Ibu Hamil dikembangkan untuk membantu tenaga kesehatan dalam memantau dan mendeteksi status gizi
                                ibu hamil secara akurat dan efisien.
                            </p>
                            <p className="mb-6 text-lg text-gray-600">
                                Dengan menggunakan algoritma Support Vector Machine (SVM), sistem ini mampu menganalisis data fisik ibu hamil dan
                                memberikan hasil deteksi status gizi yang akurat.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center">
                                    <div className="mr-3 rounded-full bg-teal-100 p-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-teal-500"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Akurasi Tinggi</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-3 rounded-full bg-teal-100 p-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-teal-500"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Mudah Digunakan</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-3 rounded-full bg-teal-100 p-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-teal-500"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Laporan Terperinci</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="mr-3 rounded-full bg-teal-100 p-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-teal-500"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Keamanan Data</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-teal-500 py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-6 text-3xl font-bold">Siap Untuk Memulai?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl">
                        Bergabunglah dengan tenaga kesehatan lainnya yang telah menggunakan sistem kami untuk memantau gizi ibu hamil dengan lebih
                        efektif.
                    </p>
                    <Link href="/login">
                        <Button className="rounded-md bg-white px-8 py-3 text-lg font-medium text-teal-500 hover:bg-gray-100">Mulai Sekarang</Button>
                    </Link>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">Hubungi Kami</h2>
                    <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
                        <div className="md:flex">
                            <div className="bg-teal-500 p-6 text-white md:w-1/3">
                                <h3 className="mb-4 text-xl font-semibold">Informasi Kontak</h3>
                                <div className="mb-4 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-3"
                                    >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>Jl. Kesehatan No. 123, Jakarta</span>
                                </div>
                                <div className="mb-4 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-3"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    <span>+62 123 4567 890</span>
                                </div>
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-3"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>info@sisgizi.com</span>
                                </div>
                            </div>
                            <div className="p-6 md:w-2/3">
                                <form>
                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Nama</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Subjek</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Pesan</label>
                                        <textarea
                                            rows={4}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                        ></textarea>
                                    </div>
                                    <Button className="rounded-md bg-teal-500 px-6 py-2 text-white hover:bg-teal-600">Kirim Pesan</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 py-8 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 h-6 w-6 text-teal-400"
                                >
                                    <path d="M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                                    <path d="M12 13a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8z" />
                                </svg>
                                <span className="text-lg font-semibold">SisGizi Ibu Hamil</span>
                            </div>
                            <p className="mt-2 text-gray-400">Sistem Deteksi Gizi Ibu Hamil dengan Algoritma SVM</p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="transition-colors hover:text-teal-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="transition-colors hover:text-teal-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="transition-colors hover:text-teal-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} SisGizi Ibu Hamil. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
