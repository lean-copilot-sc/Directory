"use client"

import * as React from "react"
import { Navbar } from "@/components/Navbar";
import { SchemaBuilder } from "@/components/SchemaBuilder";
import { FormPreview } from "@/components/FormPreview";
import { useDirectory } from "@/lib/store";
import { Field } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function SchemaPage() {
    const { schema, updateSchema, user, showAlert } = useDirectory();
    const [activeTab, setActiveTab] = React.useState<'builder' | 'preview'>('builder');

    if (!user || user.role !== 'Admin') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
                <h1 className="text-3xl font-serif text-foreground mb-2 z-10">{!user ? 'Authentication Required' : 'Restricted Access'}</h1>
                <p className="text-muted max-w-md mb-8 z-10">
                    {!user ? 'Please sign in to configure the directory schema.' : 'Only Administrators can configure the schema.'}
                </p>
                <div className="z-10">
                    <Button onClick={() => window.location.href = !user ? '/login' : '/'}>
                        {!user ? 'Sign In' : 'Go Home'}
                    </Button>
                </div>
            </div>
        )
    }

    const handleSave = (newSchema: Field[]) => {
        updateSchema(newSchema);
        showAlert(
            "Schema Core Updated",
            "The directory structure has been successfully modified and synchronized.",
            "success"
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
            <div className="relative z-10">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-border pb-6">
                        <div>
                            <h1 className="text-3xl font-serif text-foreground tracking-wide">Schema Builder</h1>
                            <p className="text-muted mt-2 text-sm max-w-xl">
                                Define the data structure for your directory.
                                Fields marked as 'Navigable' will appear in the sidebar filters.
                            </p>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                            <Button
                                variant={activeTab === 'builder' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setActiveTab('builder')}
                            >
                                Builder
                            </Button>
                            <Button
                                variant={activeTab === 'preview' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setActiveTab('preview')}
                            >
                                Preview
                            </Button>
                        </div>
                    </div>

                    {activeTab === 'builder' ? (
                        <SchemaBuilder initialSchema={schema} onSave={handleSave} />
                    ) : (
                        <div className="flex justify-center">
                            <FormPreview schema={schema} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
