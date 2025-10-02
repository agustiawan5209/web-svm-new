import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface DeleteConfirmationFormProps {
    url: string;
    title: string;
    id: number | null;
    setOpenDialog: (value: boolean) => void;
}
type indikatorFormData = {
    id: number | null;
    nama: string;
    keterangan: string;
};

export const DeleteConfirmationForm = ({ url, title, id }: DeleteConfirmationFormProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, delete: destroy, processing, errors } = useForm();
    const deleteSubmit = () => {
        if (id) {
            destroy(url, {
                preserveState: true,
                onSuccess: () => {
                    closeDialog();
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>Apakah Anda yakin ingin menghapus data ini?</DialogDescription>
                <DialogFooter>
                    <Button variant="destructive" onClick={closeDialog} disabled={processing}>
                        Batal
                    </Button>
                    <Button type="button" variant="default" onClick={deleteSubmit} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
            <Button type="button" variant={'default'} onClick={openDialog} tooltip="hapus" className="border border-chart-2 bg-chart-2">
                {' '}
                <Trash2Icon />{' '}
            </Button>
        </Dialog>
    );
};
