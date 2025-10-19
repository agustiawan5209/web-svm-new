import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { AlertCircle, ArrowUpRight, CalendarDays, UserRound, Weight } from 'lucide-react';

interface NutritionStatus {
    status: 'normal' | 'buruk' | 'beresiko';
    color: string;
}

interface PatientData {
    id: string;
    name: string;
    age: number;
    weight: number;
    height: number;
    pregnancyAge: number;
    lastCheckup: string;
    nutritionStatus: NutritionStatus;
}

const NutritionSummary = ({
    patients = [
        {
            id: '001',
            name: 'Siti Nurhaliza',
            age: 28,
            weight: 58,
            height: 160,
            pregnancyAge: 24,
            lastCheckup: '2023-06-15',
            nutritionStatus: { status: 'normal', color: 'bg-green-500' },
        },
        {
            id: '002',
            name: 'Dewi Kartika',
            age: 32,
            weight: 52,
            height: 155,
            pregnancyAge: 16,
            lastCheckup: '2023-06-12',
            nutritionStatus: { status: 'buruk', color: 'bg-amber-500' },
        },
        {
            id: '003',
            name: 'Ratna Sari',
            age: 25,
            weight: 62,
            height: 158,
            pregnancyAge: 30,
            lastCheckup: '2023-06-10',
            nutritionStatus: { status: 'beresiko', color: 'bg-red-500' },
        },
        {
            id: '004',
            name: 'Anisa Rahma',
            age: 29,
            weight: 55,
            height: 162,
            pregnancyAge: 8,
            lastCheckup: '2023-06-08',
            nutritionStatus: { status: 'normal', color: 'bg-green-500' },
        },
        {
            id: '005',
            name: 'Maya Indah',
            age: 34,
            weight: 60,
            height: 165,
            pregnancyAge: 20,
            lastCheckup: '2023-06-05',
            nutritionStatus: { status: 'normal', color: 'bg-green-500' },
        },
    ],
}: {
    patients?: PatientData[];
}) => {
    // Calculate summary statistics
    const totalPatients = patients.length;
    const statusCounts = patients.reduce(
        (acc, patient) => {
            const status = patient.nutritionStatus.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    const percentages = {
        normal: Math.round(((statusCounts.normal || 0) / totalPatients) * 100),
        buruk: Math.round(((statusCounts.buruk || 0) / totalPatients) * 100),
        beresiko: Math.round(((statusCounts.beresiko || 0) / totalPatients) * 100),
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'GuestDashboard',
            href: '/dashboard',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full rounded-lg bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Ringkasan Gizi</h1>
                        <p className="text-gray-500">Pantau status gizi ibu hamil</p>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Ibu Hamil</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <UserRound className="mr-2 h-5 w-5 text-blue-500" />
                                <div className="text-2xl font-bold">{totalPatients}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Pemeriksaan Bulan Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <CalendarDays className="mr-2 h-5 w-5 text-teal-500" />
                                <div className="text-2xl font-bold">{totalPatients}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Status Berisiko</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                                <div className="text-2xl font-bold">{statusCounts.beresiko || 0}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="mb-6">
                    <TabsList>
                        <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                        <TabsTrigger value="patients">Data Pasien</TabsTrigger>
                        <TabsTrigger value="trends">Tren</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="pt-4">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribusi Status Gizi</CardTitle>
                                    <CardDescription>Persentase status gizi ibu hamil</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="mb-1 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                                                    <span>Status Normal</span>
                                                </div>
                                                <span className="font-medium">{percentages.normal}%</span>
                                            </div>

                                            <Progress value={Number(percentages.normal)} className="h-2" />
                                        </div>

                                        <div>
                                            <div className="mb-1 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
                                                    <span>Status Buruk</span>
                                                </div>
                                                <span className="font-medium">{percentages.buruk}%</span>
                                            </div>
                                            <Progress value={percentages.buruk} className="h-2" />
                                        </div>

                                        <div>
                                            <div className="mb-1 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                                                    <span>Status Berisiko</span>
                                                </div>
                                                <span className="font-medium">{percentages.beresiko}%</span>
                                            </div>
                                            <Progress value={percentages.beresiko} className="h-2" />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-center">
                                        <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-8 border-gray-100">
                                            <div className="absolute inset-0 overflow-hidden rounded-full">
                                                <div
                                                    className="absolute top-0 left-0 bg-green-500"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + (50 * percentages.normal) / 100}% 0%)`,
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute top-0 left-0 bg-amber-500"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        clipPath: `polygon(50% 50%, ${50 + (50 * percentages.normal) / 100}% 0%, ${50 + (50 * (percentages.normal + percentages.buruk)) / 100}% ${50 - (50 * (percentages.normal + percentages.buruk)) / 100}%)`,
                                                    }}
                                                ></div>
                                                <div
                                                    className="absolute top-0 left-0 bg-red-500"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        clipPath: `polygon(50% 50%, ${50 + (50 * (percentages.normal + percentages.buruk)) / 100}% ${50 - (50 * (percentages.normal + percentages.buruk)) / 100}%, 100% 50%)`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="z-10 text-center">
                                                <div className="text-3xl font-bold">{totalPatients}</div>
                                                <div className="text-sm text-gray-500">Total</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Status Gizi Terbaru</CardTitle>
                                    <CardDescription>5 pemeriksaan terakhir</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {patients.slice(0, 5).map((patient) => (
                                            <div key={patient.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                <div>
                                                    <div className="font-medium">{patient.name}</div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Weight className="mr-1 h-3 w-3" />
                                                        {patient.weight} kg, {patient.height} cm
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <Badge className={`mr-2 ${patient.nutritionStatus.color} text-white`}>
                                                        {patient.nutritionStatus.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="patients" className="pt-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Data Ibu Hamil</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Select defaultValue="all">
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Status</SelectItem>
                                                <SelectItem value="normal">Status Normal</SelectItem>
                                                <SelectItem value="buruk">Status Buruk</SelectItem>
                                                <SelectItem value="beresiko">Status Berisiko</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Usia</TableHead>
                                            <TableHead>Berat (kg)</TableHead>
                                            <TableHead>Tinggi (cm)</TableHead>
                                            <TableHead>Usia Kehamilan</TableHead>
                                            <TableHead>Pemeriksaan Terakhir</TableHead>
                                            <TableHead>Status Gizi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {patients.map((patient) => (
                                            <TableRow key={patient.id}>
                                                <TableCell className="font-medium">{patient.name}</TableCell>
                                                <TableCell>{patient.age}</TableCell>
                                                <TableCell>{patient.weight}</TableCell>
                                                <TableCell>{patient.height}</TableCell>
                                                <TableCell>{patient.pregnancyAge} minggu</TableCell>
                                                <TableCell>{new Date(patient.lastCheckup).toLocaleDateString('id-ID')}</TableCell>
                                                <TableCell>
                                                    <Badge className={`${patient.nutritionStatus.color} text-white`}>
                                                        {patient.nutritionStatus.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="trends" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tren Status Gizi</CardTitle>
                                <CardDescription>Perubahan status gizi dalam 6 bulan terakhir</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex h-[300px] items-center justify-center">
                                    <p className="text-gray-500">Grafik tren status gizi akan ditampilkan di sini</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifikasi Status Gizi</CardTitle>
                        <CardDescription>Pasien yang memerlukan perhatian khusus</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {patients.filter((p) => p.nutritionStatus.status === 'beresiko').length > 0 ? (
                            <div className="space-y-4">
                                {patients
                                    .filter((p) => p.nutritionStatus.status === 'beresiko')
                                    .map((patient) => (
                                        <div
                                            key={patient.id}
                                            className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4"
                                        >
                                            <div className="flex items-center">
                                                <AlertCircle className="mr-3 h-5 w-5 text-red-500" />
                                                <div>
                                                    <div className="font-medium">{patient.name} memerlukan perhatian khusus</div>
                                                    <div className="text-sm text-gray-600">
                                                        Status gizi beresiko dengan berat {patient.weight} kg pada usia kehamilan{' '}
                                                        {patient.pregnancyAge} minggu
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Lihat Detail
                                            </Button>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-6 text-gray-500">
                                Tidak ada notifikasi status gizi beresiko saat ini
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default NutritionSummary;
