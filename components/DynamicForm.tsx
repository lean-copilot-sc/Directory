"use client"
import * as React from "react"
import { Field } from "@/lib/types"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DynamicFormProps {
    schema: Field[];
    initialData?: any;
    onSubmit?: (data: any) => void;
}

export function DynamicForm({ schema, initialData = {}, onSubmit }: DynamicFormProps) {
    const formRef = React.useRef<HTMLFormElement>(null);

    // Organize fields by page
    const pages = React.useMemo(() => {
        const hasPageAssignments = schema.some(f => f.page && f.page.trim() !== '');

        if (!hasPageAssignments) {
            const groups = new Map<string, Field[]>();
            schema.forEach(field => {
                const groupName = field.group || 'General';
                if (!groups.has(groupName)) {
                    groups.set(groupName, []);
                }
                groups.get(groupName)!.push(field);
            });

            return [{
                name: 'default',
                groups: Array.from(groups.entries())
            }];
        }

        // Ensure consistent page ordering by collecting them as they appear in schema
        const pageNamesInOrder: string[] = [];
        schema.forEach(f => {
            const p = (f.page && f.page.trim()) || 'General Information';
            if (!pageNamesInOrder.includes(p)) {
                pageNamesInOrder.push(p);
            }
        });

        const pageMap = new Map<string, Map<string, Field[]>>();
        pageNamesInOrder.forEach(name => pageMap.set(name, new Map()));

        schema.forEach(field => {
            const pageName = (field.page && field.page.trim()) || 'General Information';
            const pageGroups = pageMap.get(pageName)!;
            const groupName = field.group || 'General';

            if (!pageGroups.has(groupName)) {
                pageGroups.set(groupName, []);
            }
            pageGroups.get(groupName)!.push(field);
        });

        return Array.from(pageMap.entries())
            .filter(([_, groups]) => groups.size > 0) // Remove empty pages if any
            .map(([name, groups]) => ({
                name,
                groups: Array.from(groups.entries())
            }));
    }, [schema]);

    const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
    const isMultiPage = pages.length > 1;
    const currentPage = pages[currentPageIndex];
    const isLastPage = currentPageIndex === pages.length - 1;
    const isFirstPage = currentPageIndex === 0;

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLastPage) {
            setCurrentPageIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isFirstPage) {
            setCurrentPageIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Guard: If it's a multi-page form and we're not on the last page, do nothing.
        // This prevents the "Next" button from accidentally submitting the form.
        if (isMultiPage && !isLastPage) {
            return;
        }

        const formData = new FormData(e.target as HTMLFormElement);
        const data: any = {};
        formData.forEach((value, key) => {
            if (data[key]) {
                if (!Array.isArray(data[key])) data[key] = [data[key]];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });
        if (onSubmit) onSubmit(data);
    };

    const renderInput = (field: Field) => {
        const baseClass = "w-full bg-surface-highlight border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted/30";
        const value = initialData[field.id];

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        name={field.id}
                        defaultValue={value}
                        className={`${baseClass} min-h-[120px] resize-y`}
                        placeholder={`Enter ${field.name}...`}
                        rows={4}
                    />
                );

            case 'choice-select':
                return (
                    <select
                        name={field.id}
                        defaultValue={value}
                        className={baseClass}
                    >
                        <option value="">-- Select {field.name} --</option>
                        {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );

            case 'choice-radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map(opt => (
                            <label key={opt} className="flex items-center gap-3 cursor-pointer group p-2 rounded-sm hover:bg-surface-highlight border border-transparent hover:border-border transition-all">
                                <div className="w-5 h-5 border-2 border-border bg-surface rounded-full flex items-center justify-center group-hover:border-primary transition-colors relative">
                                    <input
                                        type="radio"
                                        name={field.id}
                                        value={opt}
                                        defaultChecked={value === opt}
                                        className="appearance-none peer absolute inset-0 w-full h-full cursor-pointer z-10"
                                    />
                                    <div className="w-2.5 h-2.5 bg-primary opacity-0 peer-checked:opacity-100 transition-opacity rounded-full" />
                                </div>
                                <span className="text-sm group-hover:text-foreground">{opt}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'choice-checkbox':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {field.options?.map(opt => {
                            const isChecked = Array.isArray(value) ? value.includes(opt) : value === opt;
                            return (
                                <label key={opt} className="flex items-center gap-3 cursor-pointer group p-2 rounded-sm hover:bg-surface-highlight border border-transparent hover:border-border transition-all">
                                    <div className="w-5 h-5 border border-border bg-surface rounded-sm flex items-center justify-center group-hover:border-primary transition-colors relative">
                                        <input
                                            type="checkbox"
                                            name={field.id}
                                            value={opt}
                                            defaultChecked={isChecked}
                                            className="appearance-none peer absolute inset-0 w-full h-full cursor-pointer z-10"
                                        />
                                        <div className="w-2.5 h-2.5 bg-primary opacity-0 peer-checked:opacity-100 transition-opacity rounded-[1px]" />
                                    </div>
                                    <span className="text-sm group-hover:text-foreground">{opt}</span>
                                </label>
                            )
                        })}
                    </div>
                )

            case 'date':
                const inputType = field.dateConfig?.includeTime ? 'datetime-local' : 'date';
                const defaultDate = field.dateConfig?.defaultToToday && !value
                    ? new Date().toISOString().split('T')[0]
                    : value;

                return (
                    <input
                        type={inputType}
                        name={field.id}
                        defaultValue={defaultDate}
                        className={baseClass}
                    />
                );

            case 'number':
                return <input type="number" name={field.id} defaultValue={value} className={baseClass} placeholder="0.00" step="0.1" />

            case 'file':
                return (
                    <div className="relative group">
                        <input
                            type="file"
                            name={field.id}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`${baseClass} flex items-center justify-between group-hover:border-primary transition-all`}>
                            <span className="text-muted/60 text-sm">Choose architectural asset or document...</span>
                            <div className="p-1 px-3 bg-surface border border-border rounded text-[10px] uppercase tracking-widest text-primary font-bold">
                                Browse
                            </div>
                        </div>
                    </div>
                );

            case 'address':
                return (
                    <div className="relative">
                        <input
                            type="text"
                            name={field.id}
                            defaultValue={value}
                            className={`${baseClass} pl-12`}
                            placeholder="Enter physical coordinates or address..."
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-50">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                );

            case 'rich-text':
                return (
                    <div className="space-y-2">
                        <div className="flex gap-1 mb-1">
                            {['B', 'I', 'U', 'S'].map(b => (
                                <div key={b} className="w-6 h-6 flex items-center justify-center border border-border text-[10px] text-muted hover:text-primary hover:border-primary cursor-pointer transition-all rounded-[1px] font-bold">{b}</div>
                            ))}
                        </div>
                        <textarea
                            name={field.id}
                            defaultValue={value}
                            className={`${baseClass} min-h-[160px] font-sans text-sm leading-relaxed`}
                            placeholder="Describe with sophistication..."
                        />
                    </div>
                )

            default:
                return <input type="text" name={field.id} defaultValue={value} className={baseClass} placeholder={`Enter ${field.name}...`} />
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
            {/* Progress Indicator for Multi-page */}
            {isMultiPage && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        {pages.map((page, idx) => (
                            <div key={idx} className="flex items-center flex-1">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${idx === currentPageIndex
                                    ? 'border-primary bg-primary text-black'
                                    : idx < currentPageIndex
                                        ? 'border-primary bg-primary/20 text-primary'
                                        : 'border-border bg-surface text-muted'
                                    }`}>
                                    {idx + 1}
                                </div>
                                {idx < pages.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${idx < currentPageIndex ? 'bg-primary' : 'bg-border'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-serif text-foreground">
                            {currentPage.name !== 'default' ? currentPage.name : `Step ${currentPageIndex + 1}`}
                        </h3>
                        <p className="text-xs text-muted mt-1">Page {currentPageIndex + 1} of {pages.length}</p>
                    </div>
                </div>
            )}

            {/* Core Fields */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-widest border-b border-border pb-2">Record Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-muted">Name</label>
                        <input name="name" defaultValue={initialData.name} className="w-full bg-surface-highlight border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="Record Name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-muted">Image URL</label>
                        <input name="image" defaultValue={initialData.image} className="w-full bg-surface-highlight border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs uppercase tracking-wider text-muted">Address</label>
                        <input name="address" defaultValue={initialData.address} className="w-full bg-surface-highlight border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="Full Address" />
                    </div>
                </div>
            </div>

            {/* Current Page Groups */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                >
                    {currentPage.groups.map(([group, fields], idx) => (
                        <Card key={`${currentPageIndex}-${group}`} className="border-l-2 border-l-primary/50 overflow-visible">
                            <CardHeader>
                                <CardTitle className="text-lg">{group}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                {fields.map(field => (
                                    <div key={field.id} className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                            {field.name}
                                            {field.required && <span className="text-red-400">*</span>}
                                            {field.notes && <span className="text-[10px] normal-case font-normal text-muted/50">— {field.notes}</span>}
                                        </label>
                                        <div className="relative">
                                            {renderInput(field)}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 gap-4">
                {isMultiPage && !isFirstPage ? (
                    <Button type="button" variant="outline" onClick={handlePrevious} className="gap-2">
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                ) : (
                    <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancel</Button>
                )}

                {isMultiPage && !isLastPage ? (
                    <Button type="button" onClick={handleNext} size="lg" className="gap-2">
                        Next <ChevronRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button type="submit" size="lg">Save Record</Button>
                )}
            </div>
        </form>
    );
}
