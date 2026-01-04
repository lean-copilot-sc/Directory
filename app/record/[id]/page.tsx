"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useDirectory } from "@/lib/store"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MapPin, ChevronLeft, Calendar, Share2, Printer, CheckCircle2 } from "lucide-react"

export default function RecordDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { records, schema } = useDirectory()

    const recordId = params.id as string
    const record = records.find(r => r.id === recordId)

    if (!record) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-3xl font-serif text-white mb-2">Record Not Found</h1>
                <p className="text-muted max-w-md mb-8">
                    The listing you are looking for might have been removed or is temporarily unavailable.
                </p>
                <Button variant="outline" onClick={() => router.push('/')}>Return to Directory</Button>
            </div>
        )
    }

    // Group dynamic data by schema groups
    const groupedData = schema.reduce((acc, field) => {
        const value = record.data[field.id]
        if (value !== undefined && value !== null && value !== '') {
            const groupName = field.group || 'General Information'
            if (!acc[groupName]) acc[groupName] = []
            acc[groupName].push({ field, value })
        }
        return acc
    }, {} as Record<string, { field: any, value: any }[]>)

    const renderValue = (field: any, value: any) => {
        if (Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-2">
                    {value.map((v, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {v}
                        </span>
                    ))}
                </div>
            )
        }
        if (field.type === 'date') {
            return new Date(value).toLocaleDateString(undefined, { dateStyle: 'long' })
        }
        return <span className="text-foreground/80">{String(value)}</span>
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

            <div className="relative z-10">
                <Navbar />

                <main className="container mx-auto px-4 py-8">
                    {/* Breadcrumbs / Back */}
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-8 hover:bg-white/5 -ml-4"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Search
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Image & Basic Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-[16/9] rounded-lg overflow-hidden border border-border group"
                            >
                                <img
                                    src={record.image}
                                    alt={record.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8">
                                    <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-sm border border-primary/20 mb-4 inline-block">
                                        {record.category}
                                    </span>
                                    <h1 className="text-4xl md:text-6xl font-serif text-white tracking-wide">{record.name}</h1>
                                </div>
                            </motion.div>

                            {/* Dynamic Sections */}
                            <div className="grid grid-cols-1 gap-8">
                                {Object.entries(groupedData).map(([group, items], idx) => (
                                    <motion.div
                                        key={group}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card className="bg-surface/50 backdrop-blur-sm border-border">
                                            <CardHeader className="border-b border-border/50">
                                                <CardTitle className="text-xl font-serif text-primary tracking-widest uppercase text-sm">
                                                    {group}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                    {items.map(({ field, value }) => (
                                                        <div key={field.id} className="space-y-1">
                                                            <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">
                                                                {field.name}
                                                            </dt>
                                                            <dd className="text-base">
                                                                {renderValue(field, value)}
                                                            </dd>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Sidebar Info */}
                        <div className="space-y-8">
                            <Card className="bg-surface border-primary/20 sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-lg font-serif">Quick Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-muted tracking-wider">Address</p>
                                            <p className="text-sm mt-1">{record.address}</p>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(record.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline mt-2 inline-block"
                                            >
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-muted tracking-wider">Added On</p>
                                            <p className="text-sm mt-1">October 12, 2023</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border flex flex-col gap-3">
                                        <Button className="w-full">Book Experience</Button>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Share2 className="w-4 h-4 mr-2" /> Share
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Printer className="w-4 h-4 mr-2" /> Print
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Verified Listing</span>
                                </div>
                                <p className="text-xs text-muted leading-relaxed">
                                    This establishment has been verified by the Luxe Directory team for quality, service, and authenticity.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
