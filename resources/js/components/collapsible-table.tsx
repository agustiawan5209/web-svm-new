// components/CollapsibleRow.tsx
import { Link } from '@inertiajs/react';
import { ChevronDownIcon, EyeIcon, PenBoxIcon } from 'lucide-react';
import React, { useState } from 'react';
import { DeleteConfirmationForm } from './delete-confirmation-form';
import { Button } from './ui/button';
import { TableCell, TableRow } from './ui/table';

interface CollapsibleRowProps {
    num: string | number;
    title: string;
    columnData: string[];
    children: React.ReactNode;
    show?: string;
    edit?: string;
    delete?: string;
    id?: string;
    url?: string;
}

const CollapsibleRow: React.FC<CollapsibleRowProps> = ({ num, title, columnData = [], children, show, edit, delete: destroy, id, url }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialog, setisDeleteDialog] = useState(false);
    return (
        <>
            <TableRow className="border-b">
                <TableCell>{num}</TableCell>

                <TableCell className="p-2">
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-sm text-blue-600 hover:underline dark:text-white">
                        {title}
                        <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </TableCell>
                {columnData.map((data, index) => (
                    <TableCell key={index}>{data}</TableCell>
                ))}
                <TableCell>
                    <div className="flex flex-row items-center gap-2">
                        {destroy && id && (
                            <DeleteConfirmationForm title={`Hapus data`} id={Number(id) as number} url={destroy} setOpenDialog={setisDeleteDialog} />
                        )}
                        {show && (
                            <Link href={show}>
                                <Button variant={'default'} type="button" tooltip="detail" className="bg-chart-1">
                                    <EyeIcon size={4} />
                                </Button>
                            </Link>
                        )}
                        {edit && (
                            <Link href={edit}>
                                <Button variant={'default'} type="button" className="bg-chart-4">
                                    <PenBoxIcon size={4} />
                                </Button>
                            </Link>
                        )}
                    </div>
                </TableCell>
            </TableRow>

            {isOpen && (
                <tr className="bg-gray-100">
                    <td colSpan={columnData.length + 3} className="p-4 text-gray-700">
                        <div className={`animate-fade-in overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                            {children}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default CollapsibleRow;
