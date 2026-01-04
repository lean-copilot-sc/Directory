"use client"
import { Navbar } from "@/components/Navbar";
import { DynamicForm } from "@/components/DynamicForm";
import { useDirectory } from "@/lib/store";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { DirectoryRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function EditRecordPage() {
    const { schema, records, updateRecord } = useDirectory();
    const router = useRouter();
    const params = useParams();
    const [record, setRecord] = useState<DirectoryRecord | undefined>(undefined);

    useEffect(() => {
        if (params.id) {
            const found = records.find(r => r.id === params.id);
            if (found) {
                setRecord(found);
            } else {
                // Handle not found
                // router.push('/admin/listings');
            }
        }
    }, [params.id, records]);

    const handleSubmit = (data: any) => {
        if (!record) return;

        const { name, address, ...dynamicData } = data;

        const updatedRecord: DirectoryRecord = {
            ...record,
            name: name,
            address: address,
            data: dynamicData
        };

        updateRecord(updatedRecord);
        alert("Record Updated Successfully!");
        router.back();
    };

    if (!record) return <div className="p-10 text-center text-muted">Loading record...</div>;

    // Merge core fields into the initial data object for the form
    const initialData = {
        name: record.name,
        address: record.address,
        ...record.data
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
            <div className="relative z-10">
                <Navbar />
                <main className="container mx-auto px-4 py-10">
                    <div className="max-w-3xl mx-auto mb-10 pb-6 border-b border-border flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-serif text-white tracking-wide">Edit Listing</h1>
                            <p className="text-muted mt-1 text-sm">Update the details for <span className="text-primary">{record.name}</span>.</p>
                        </div>
                        <Link href={`/record/${record.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Eye className="w-4 h-4" /> View Listing
                            </Button>
                        </Link>
                    </div>
                    <DynamicForm schema={schema} initialData={initialData} onSubmit={handleSubmit} />
                </main>
            </div>
        </div>
    );
}
