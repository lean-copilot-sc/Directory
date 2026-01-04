"use client";

import { useDirectory } from "@/lib/store";
import { CopyX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = useDirectory();

    // Block 'User' role from accessing any /admin route
    if (user.role === 'User') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
                <div className="w-16 h-16 bg-surface border border-red-900/40 rounded-full flex items-center justify-center mb-6 z-10">
                    <CopyX className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-3xl font-serif text-white mb-2 z-10">Access Denied</h1>
                <p className="text-muted max-w-md mb-8 z-10">
                    You do not have permission to view this area. This section is restricted to Administrators and Owners.
                </p>
                <Link href="/" className="z-10">
                    <Button variant="outline">Return to Directory</Button>
                </Link>
            </div>
        );
    }

    return <>{children}</>;
}
