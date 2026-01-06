"use client"

import * as React from "react"
import { Field, DirectoryRecord, SystemConfig } from "@/lib/types"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X, ArrowRight, Filter, ChevronDown, Lock } from "lucide-react"
import Link from "next/link"
import { useDirectory } from "@/lib/store"

interface DirectoryListingProps {
    initialRecords: DirectoryRecord[]
    schema: Field[]
    config?: SystemConfig
}

export function DirectoryListing({ initialRecords, schema, config }: DirectoryListingProps) {
    const { user } = useDirectory();
    const defaultLayout = config?.defaultLayout || 'Grid';
    const [userLayout, setUserLayout] = React.useState<'Grid' | 'List'>(defaultLayout);
    const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({})
    const [sortField, setSortField] = React.useState<string | null>(null)
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc')
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);

    // Use user-selected layout if available, otherwise use default
    const activeLayout = userLayout;

    // Get navigable fields with their unique values from actual records
    const navigableFields = React.useMemo(() => {
        return schema
            .filter(f => f.navigable)
            .map(field => {
                // Extract unique values from records for this field
                const uniqueValues = new Set<string>();
                initialRecords.forEach(record => {
                    const value = record.data[field.id];
                    if (Array.isArray(value)) {
                        value.forEach(v => uniqueValues.add(String(v)));
                    } else if (value) {
                        uniqueValues.add(String(value));
                    }
                });
                return {
                    ...field,
                    availableValues: Array.from(uniqueValues).sort()
                };
            });
    }, [schema, initialRecords]);

    // Get filterable fields
    const filterableFields = React.useMemo(() => {
        return schema
            .filter(f => f.filterable && !f.navigable) // Don't duplicate navigable fields
            .map(field => {
                const uniqueValues = new Set<string>();
                initialRecords.forEach(record => {
                    const value = record.data[field.id];
                    if (Array.isArray(value)) {
                        value.forEach(v => uniqueValues.add(String(v)));
                    } else if (value) {
                        uniqueValues.add(String(value));
                    }
                });
                return {
                    ...field,
                    availableValues: Array.from(uniqueValues).sort()
                };
            });
    }, [schema, initialRecords]);

    // Get sortable fields
    const sortableFields = schema.filter(f => f.sortable);

    // Filter Logic
    const filteredRecords = React.useMemo(() => {
        return initialRecords.filter(record => {
            // Iterate over active filters
            return Object.entries(selectedFilters).every(([fieldId, values]) => {
                if (values.length === 0) return true;
                const recordValue = record.data[fieldId];
                // Handle array values (checkboxes) and single values
                if (Array.isArray(recordValue)) {
                    return values.some(v => recordValue.includes(v));
                }
                return values.includes(String(recordValue));
            });
        }).sort((a, b) => {
            if (!sortField) return 0;
            const valA = a.data[sortField];
            const valB = b.data[sortField];

            // Handle different data types
            const compareA = typeof valA === 'number' ? valA : String(valA || '');
            const compareB = typeof valB === 'number' ? valB : String(valB || '');

            if (sortDirection === 'asc') {
                return compareA > compareB ? 1 : -1;
            } else {
                return compareA > compareB ? -1 : 1;
            }
        });
    }, [initialRecords, selectedFilters, sortField, sortDirection]);

    const toggleFilter = (fieldId: string, value: string) => {
        setSelectedFilters(prev => {
            const existing = prev[fieldId] || [];
            if (existing.includes(value)) {
                return { ...prev, [fieldId]: existing.filter(v => v !== value) };
            }
            return { ...prev, [fieldId]: [...existing, value] };
        });
    };

    const toggleSort = (fieldId: string) => {
        if (sortField === fieldId) {
            // Toggle direction or clear
            if (sortDirection === 'desc') {
                setSortDirection('asc');
            } else {
                setSortField(null);
                setSortDirection('desc');
            }
        } else {
            setSortField(fieldId);
            setSortDirection('desc');
        }
    };

    const FilterSidebar = ({ isMobile = false }) => (
        <div className={`space-y-8 ${isMobile ? 'pt-20 px-6 pb-12' : ''}`}>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif tracking-widest text-primary font-bold italic">FILTERS</h2>
                {Object.keys(selectedFilters).length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFilters({})} className="text-muted hover:text-primary h-auto p-0 hover:bg-transparent text-[10px] uppercase tracking-tighter">
                        <X className="w-3 h-3 mr-1" /> Clear All
                    </Button>
                )}
            </div>

            {navigableFields.map(field => (
                <div key={field.id} className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase text-muted tracking-[0.2em] border-b border-border pb-2">{field.name}</h3>
                    <div className="space-y-1">
                        {field.availableValues?.map(opt => {
                            const isSelected = selectedFilters[field.id]?.includes(opt);
                            return (
                                <div
                                    key={opt}
                                    onClick={() => toggleFilter(field.id, opt)}
                                    className={`
                                        cursor-pointer px-3 py-2 rounded-sm text-sm transition-all flex items-center justify-between group
                                        ${isSelected ? 'bg-primary/10 text-primary border-l-2 border-primary font-bold shadow-[inset_4px_0_10px_rgba(var(--primary-rgb),0.05)]' : 'text-foreground/60 hover:text-foreground hover:bg-surface-highlight font-medium'}
                                    `}
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">{opt}</span>
                                    {isSelected && <motion.div layoutId={`dot-${field.id}${isMobile ? '-mob' : ''}`} className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {filterableFields.map(field => (
                <div key={field.id} className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase text-muted tracking-[0.2em] border-b border-border pb-2">{field.name}</h3>
                    <div className="space-y-1">
                        {field.availableValues?.map(opt => {
                            const isSelected = selectedFilters[field.id]?.includes(opt);
                            return (
                                <div
                                    key={opt}
                                    onClick={() => toggleFilter(field.id, opt)}
                                    className={`
                                        cursor-pointer px-3 py-2 rounded-sm text-sm transition-all flex items-center justify-between group
                                        ${isSelected ? 'bg-primary/10 text-primary border-l-2 border-primary font-bold' : 'text-foreground/60 hover:text-foreground hover:bg-surface-highlight font-medium'}
                                    `}
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">{opt}</span>
                                    {isSelected && <motion.div layoutId={`filter-dot-${field.id}${isMobile ? '-mob' : ''}`} className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row min-h-screen relative">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 border-r border-border bg-surface p-6 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
                <FilterSidebar />
            </aside>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterDrawerOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[300px] bg-surface border-r border-border z-[101] lg:hidden overflow-y-auto shadow-2xl"
                        >
                            <div className="absolute top-6 right-6">
                                <Button variant="ghost" size="sm" onClick={() => setIsFilterDrawerOpen(false)}>
                                    <X className="w-5 h-5 text-primary" />
                                </Button>
                            </div>
                            <FilterSidebar isMobile />
                            <div className="sticky bottom-0 left-0 right-0 p-6 bg-surface border-t border-border">
                                <Button className="w-full shadow-[0_0_20px_rgba(212,175,55,0.2)]" onClick={() => setIsFilterDrawerOpen(false)}>
                                    Show {filteredRecords.length} Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Anonymous Access Guard */}
            {(!config?.anonymousAccess && !user) ? (
                <main className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-background/50 backdrop-blur-sm">
                    <div className="max-w-md space-y-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                            <Lock className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-serif text-foreground">Exclusive Gallery</h2>
                        <p className="text-muted leading-relaxed">
                            Full access to our curated directory is reserved for registered members.
                            Please sign in to browse listings, apply filters, and view full details.
                        </p>
                        <Button asChild size="lg" className="px-10 shadow-xl shadow-primary/20">
                            <Link href="/login">Sign In for Access</Link>
                        </Button>
                    </div>
                </main>
            ) : (
                <main className="flex-1 p-6 lg:p-10">
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-serif text-foreground tracking-wide mb-2">
                                {config?.heroText || "Exclusive Listings"}
                            </h1>
                            <p className="text-muted text-sm uppercase tracking-widest">Showing {filteredRecords.length} curated results</p>
                        </div>

                        {/* Dynamic Sort Controls & Layout Toggle */}
                        <div className="flex gap-4 flex-wrap items-center">
                            {/* Mobile Filter Button */}
                            <div className="lg:hidden w-full mb-4">
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 border-primary/20 bg-surface/50"
                                    onClick={() => setIsFilterDrawerOpen(true)}
                                >
                                    <Filter className="w-4 h-4 text-primary" />
                                    Filters {Object.keys(selectedFilters).length > 0 && `(${Object.keys(selectedFilters).length})`}
                                </Button>
                            </div>

                            {/* Layout Toggle */}
                            <div className="flex gap-2 border-r border-border pr-4">
                                <Button
                                    variant={activeLayout === 'Grid' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setUserLayout('Grid')}
                                    className="gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                                        <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                                        <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                                        <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                                    </svg>
                                    Grid
                                </Button>
                                <Button
                                    variant={activeLayout === 'List' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setUserLayout('List')}
                                    className="gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
                                        <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
                                        <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
                                    </svg>
                                    List
                                </Button>
                            </div>

                            {/* Sort Controls */}
                            {sortableFields.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-xs text-muted uppercase tracking-wider self-center mr-2">Sort by:</span>
                                    {sortableFields.map(field => {
                                        const isActive = sortField === field.id;
                                        return (
                                            <Button
                                                key={field.id}
                                                variant={isActive ? 'primary' : 'outline'}
                                                size="sm"
                                                onClick={() => toggleSort(field.id)}
                                                className="gap-1"
                                            >
                                                {field.name}
                                                {isActive && (
                                                    <span className="text-xs">
                                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={
                        activeLayout === 'Grid'
                            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                            : "space-y-4"
                    }>
                        <AnimatePresence mode="popLayout">
                            {filteredRecords.map((record) => (
                                <motion.div
                                    key={record.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className={activeLayout === 'List' ? "w-full" : "h-full"}
                                >
                                    <Link href={`/record/${record.id}`} className="block h-full">
                                        <Card className={`
                                        hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.15)] shadow-sm border-border/60 hover:border-primary/40 group cursor-pointer overflow-hidden bg-surface flex 
                                        ${activeLayout === 'List' ? 'flex-row min-h-[150px] md:h-52' : 'flex-col h-full'}
                                    `}>
                                            <div className={`
                                        relative overflow-hidden flex-shrink-0
                                        ${activeLayout === 'List' ? 'w-32 md:w-1/3' : 'h-64 w-full'}
                                    `}>
                                                <img src={record.image} alt={record.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent p-3 flex justify-between items-start">
                                                    <span className="text-primary text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] bg-black/50 backdrop-blur-md px-2 py-1 rounded-sm border border-primary/30">
                                                        {record.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`flex flex-col flex-1 p-4 ${activeLayout === 'List' ? 'justify-between min-w-0' : ''}`}>
                                                <CardHeader className="p-0 pb-2">
                                                    <CardTitle className={`group-hover:text-primary transition-colors truncate ${activeLayout === 'List' ? 'text-base md:text-xl' : 'text-xl'}`}>
                                                        {record.name}
                                                    </CardTitle>
                                                    <div className="flex items-center text-muted text-[10px] md:text-xs mt-1 uppercase tracking-wide truncate">
                                                        <MapPin className="w-3 h-3 mr-1 text-primary shrink-0" />
                                                        <span className="truncate">{record.address}</span>
                                                    </div>
                                                </CardHeader>

                                                {/* Hidden on very small list items to save space */}
                                                <CardContent className={`p-0 py-2 ${activeLayout === 'List' ? 'hidden md:block' : ''}`}>
                                                    <div className="flex flex-col gap-2">
                                                        {schema.filter(f => f.displayInListing && record.data[f.id]).slice(0, activeLayout === 'List' ? 2 : 10).map(field => {
                                                            const value = record.data[field.id];
                                                            return (
                                                                <div key={field.id} className="flex justify-between items-center text-xs border-b border-border/30 pb-1 last:border-0">
                                                                    <span className="text-muted uppercase tracking-wider text-[10px]">{field.name}</span>
                                                                    <span className="font-medium text-foreground">{value}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </CardContent>

                                                <CardFooter className={`p-0 pt-2 ${activeLayout === 'Grid' ? 'mt-auto' : ''} flex justify-between items-center border-t border-border/50`}>
                                                    <div className="flex items-end gap-1">
                                                        <span className="text-primary font-serif italic text-lg md:text-2xl leading-none">{record.data['Rating_01']}</span>
                                                        <span className="text-[10px] text-muted pb-0.5">/ 5.0</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] hover:bg-primary hover:text-black hover:border-transparent border border-border transition-all md:h-9 md:px-4 md:text-sm">Details</Button>
                                                </CardFooter>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </main>
            )}
        </div>
    )
}
