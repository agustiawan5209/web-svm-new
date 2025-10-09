import MainLayout from '@/layouts/guest/main-layout';
import { PropsWithChildren } from 'react';

export default function UserAuthLayout({ children }: PropsWithChildren) {
    return (
        <MainLayout>
            {/* Hero Section */}
            <main className="py-4">{children}</main>
        </MainLayout>
    );
}
