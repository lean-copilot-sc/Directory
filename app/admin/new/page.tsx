"use client"
import { Navbar } from "@/components/Navbar";
import { DynamicForm } from "@/components/DynamicForm";
import { useDirectory } from "@/lib/store";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function NewRecordPage() {
    const { schema, addRecord } = useDirectory();
    const router = useRouter();

    const handleSubmit = (data: any) => {
        // Extract core fields that are outside the dynamic data
        const { name, address, ...dynamicData } = data;

        // In a real app we'd handle image upload. using placeholder for now.
        const newRecord = {
            id: uuidv4(),
            ownerId: 'owner-1', // Set to owner-1 to match My Listings demo
            category: 'Boutique' as const, // Default or add a selector
            name: name,
            address: address,
            image: "https://placehold.co/600x400/1a1a1a/D4AF37?text=New+Listing",
            data: dynamicData
        };

        addRecord(newRecord);
        alert("Record Created Successfully!");
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
            <div className="relative z-10">
                <Navbar />
                <main className="container mx-auto px-4 py-10">
                    <div className="max-w-3xl mx-auto mb-10 border-l-4 border-primary pl-6">
                        <h1 className="text-4xl font-serif text-white tracking-wide">Add New Listing</h1>
                        <p className="text-muted mt-2 text-lg">Create a new entry in the directory using the configured schema.</p>
                    </div>
                    <DynamicForm schema={schema} onSubmit={handleSubmit} />
                </main>
            </div>
        </div>
    );
}
