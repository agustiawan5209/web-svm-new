import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type JenisRumputLaut = {
    nama: string;
    jumlah: number;
};

interface Transaction {
    panjangGarisPantai: number;
    jumlahPetani: number;
    luasPotensi: number;
    luasTanam: number;
    jumlahTali: number;
    jumlahBibit: number;
    suhuAir: number;
    salinitas: number;
    kejernihanAir: string;
    cahayaMatahari: string;
    arusAir: string;
    kedalamanAir: number;
    pHAir: number;
    ketersediaanGizi: string;
    eucheuma_conttoni: number;
    gracilaria_sp: number;
}

const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const opsiKejernihan = [
    { value: 5, label: 'Sangat Jernih' },
    { value: 4, label: 'Jernih' },
    { value: 3, label: 'Agak Keruh' },
    { value: 2, label: 'Keruh' },
    { value: 1, label: 'Sangat Keruh' },
];
const opsiCahaya = [
    { value: 5, label: 'Sangat Cerah' },
    { value: 4, label: 'Cerah' },
    { value: 3, label: 'Berawan' },
    { value: 2, label: 'Mendung' },
    { value: 1, label: 'Gelap' },
];
const opsiArus = [
    { value: 5, label: 'Sangat Kuat' },
    { value: 4, label: 'Kuat' },
    { value: 3, label: 'Sedang' },
    { value: 2, label: 'Lemah' },
    { value: 1, label: 'Sangat Lemah' },
];
const opsiGizi = [
    { value: 4, label: 'Melimpah' },
    { value: 3, label: 'Cukup' },
    { value: 2, label: 'Terbatas' },
    { value: 1, label: 'Sangat Sedikit' },
];
interface PropsDatasetView {
    parameter: Transaction;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
}

export default function FormPanen({ parameter, handleChange, handleSelectChange }: PropsDatasetView) {
    return (
        <>
            <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <div>
                        <Label className="text-xs text-gray-600">Panjang Garis Pantai (km)</Label>
                        <Input
                            type="number"
                            name="panjangGarisPantai"
                            value={parameter.panjangGarisPantai}
                            onChange={handleChange}
                            className="input-minimal"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Jumlah Petani</Label>
                        <Input type="number" name="jumlahPetani" value={parameter.jumlahPetani} onChange={handleChange} className="input-minimal" />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Luas Potensi (Ha)</Label>
                        <Input
                            type="number"
                            name="luasPotensi"
                            value={parameter.luasPotensi}
                            onChange={handleChange}
                            className="input-minimal"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Luas Tanam (Ha)</Label>
                        <Input
                            type="number"
                            name="luasTanam"
                            value={parameter.luasTanam}
                            onChange={handleChange}
                            className="input-minimal"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Jumlah Tali</Label>
                        <Input type="number" name="jumlahTali" value={parameter.jumlahTali} onChange={handleChange} className="input-minimal" />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Bibit (kg)</Label>
                        <Input
                            type="number"
                            name="jumlahBibit"
                            value={parameter.jumlahBibit}
                            onChange={handleChange}
                            className="input-minimal"
                            step="0.01"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div>
                        <Label className="text-xs text-gray-600">Suhu Air (°C)</Label>
                        <Input type="number" name="suhuAir" value={parameter.suhuAir} onChange={handleChange} className="input-minimal" step="0.1" />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Salinitas (ppt)</Label>
                        <Input
                            type="number"
                            name="salinitas"
                            value={parameter.salinitas}
                            onChange={handleChange}
                            className="input-minimal"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Kejernihan Air</Label>
                        <Select value={parameter.kejernihanAir} onValueChange={(value) => handleSelectChange('kejernihanAir', value)}>
                            <SelectTrigger className="input-minimal">
                                <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                                {opsiKejernihan.map((option) => (
                                    <SelectItem key={option.value} value={option.label}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Cahaya Matahari</Label>
                        <Select value={parameter.cahayaMatahari} onValueChange={(value) => handleSelectChange('cahayaMatahari', value)}>
                            <SelectTrigger className="input-minimal">
                                <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                                {opsiCahaya.map((option) => (
                                    <SelectItem key={option.value} value={option.label}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Arus Air</Label>
                        <Select value={parameter.arusAir} onValueChange={(value) => handleSelectChange('arusAir', value)}>
                            <SelectTrigger className="input-minimal">
                                <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                                {opsiArus.map((option) => (
                                    <SelectItem key={option.value} value={option.label}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Kedalaman Air (m)</Label>
                        <Input
                            type="number"
                            name="kedalamanAir"
                            value={parameter.kedalamanAir}
                            onChange={handleChange}
                            className="input-minimal"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">pH Air</Label>
                        <Input
                            type="number"
                            name="pHAir"
                            value={parameter.pHAir}
                            onChange={handleChange}
                            className="input-minimal"
                            step="0.1"
                            min="0"
                            max="14"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Ketersediaan Gizi</Label>
                        <Select value={parameter.ketersediaanGizi} onValueChange={(value) => handleSelectChange('ketersediaanGizi', value)}>
                            <SelectTrigger className="input-minimal">
                                <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                                {opsiGizi.map((option) => (
                                    <SelectItem key={option.value} value={option.label}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </>
    );
}
