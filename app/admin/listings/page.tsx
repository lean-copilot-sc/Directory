"use client"
import { Navbar } from "@/components/Navbar";
import { useDirectory } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, Edit, Eye, Trash } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExportImport } from "@/components/ExportImport";
import { Badge } from "@/components/ui/badge";

export default function OwnerListingsPage() {
    const { records, deleteRecord, importRecords, user, showConfirm } = useDirectory();

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-serif text-foreground mb-4">Authentication Required</h1>
                <Button onClick={() => window.location.href = '/login'}>Sign In</Button>
            </div>
        );
    }

    // Admin sees all records, Owner only sees their own
    const displayRecords = user.role === 'Admin' ? records : records.filter(r => r.ownerId === user.id);
    const title = user.role === 'Admin' ? 'All Listings' : 'My Listings';
    const subtitle = user.role === 'Admin' ? 'Manage all entries in the directory.' : 'Manage your properties and directory entries.';

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
            <div className="relative z-10">
                <Navbar />
                <main className="container mx-auto px-4 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-border pb-6">
                        <div>
                            <h1 className="text-3xl font-serif text-foreground tracking-wide">{title}</h1>
                            <p className="text-muted mt-2 text-sm">{subtitle}</p>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                            <ExportImport records={displayRecords} onImport={importRecords} />
                            <Button asChild className="w-44">
                                <Link href="/admin/new">Add New Listing</Link>
                            </Button>
                        </div>
                    </div>

                    {displayRecords.length === 0 ? (
                        <div className="text-center py-20 bg-surface/20 rounded-lg border border-border border-dashed">
                            <p className="text-muted mb-4">No listings found.</p>
                            <Button variant="outline" asChild><Link href="/admin/new">Create First Listing</Link></Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayRecords.map(record => (
                                <motion.div key={record.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <Card className="h-full bg-surface border-border hover:border-primary/30 transition-all group">
                                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                                            <img src={record.image} alt={record.name} className="w-full h-full object-cover transition-all duration-500" />
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <Link href={`/record/${record.id}`}>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/50 backdrop-blur text-white hover:bg-primary hover:text-black">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <Link href={`/record/${record.id}`}>
                                                <CardTitle className="text-lg truncate hover:text-primary transition-colors cursor-pointer">{record.name}</CardTitle>
                                            </Link>
                                            <div className="flex items-center text-muted text-xs mt-1">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                <span className="truncate">{record.address}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="surface">{record.category}</Badge>
                                                <Badge variant="success">Active</Badge>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="border-t border-border/50 pt-4 flex gap-2">
                                            <Button asChild variant="outline" size="sm" className="flex-1">
                                                <Link href={`/admin/edit/${record.id}`}>
                                                    <Edit className="w-3 h-3 mr-2" /> Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                                onClick={() => {
                                                    showConfirm(
                                                        "Delete Listing?",
                                                        `Are you sure you want to permanently remove "${record.name}" from the directory?`,
                                                        () => deleteRecord(record.id),
                                                        'danger'
                                                    );
                                                }}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
