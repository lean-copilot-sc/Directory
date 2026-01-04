"use client"

import * as React from "react"
import { Field } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { motion } from "framer-motion"

interface FormPreviewProps {
    schema: Field[];
}

export function FormPreview({ schema }: FormPreviewProps) {
    // Group fields
    const groups = React.useMemo(() => {
        const g: Record<string, Field[]> = {};
        schema.forEach(f => {
            const groupName = f.group || 'General';
            if (!g[groupName]) g[groupName] = [];
            g[groupName].push(f);
        });
        return g;
    }, [schema]);

    const renderPreviewInput = (field: Field) => {
        const baseClass = "w-full bg-surface-highlight border border-border rounded-sm px-4 py-3 text-foreground/50 cursor-not-allowed";

        switch (field.type) {
            case 'textarea':
                return <textarea disabled className={`${baseClass} min-h-[120px] resize-none`} placeholder={`Enter ${field.name}...`} rows={4} />;

            case 'choice-select':
                return (
                    <select disabled className={baseClass}>
                        <option>-- Select {field.name} --</option>
                        {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                );

            case 'choice-radio':
                return (
                    <div className="space-y-2 opacity-50">
                        {field.options?.slice(0, 3).map(opt => (
                            <label key={opt} className="flex items-center gap-3 p-2">
                                <div className="w-5 h-5 border-2 border-border bg-surface rounded-full" />
                                <span className="text-sm">{opt}</span>
                            </label>
                        ))}
                        {(field.options?.length || 0) > 3 && <span className="text-xs text-muted ml-8">+{(field.options?.length || 0) - 3} more</span>}
                    </div>
                );

            case 'choice-checkbox':
                return (
                    <div className="grid grid-cols-2 gap-3 opacity-50">
                        {field.options?.slice(0, 4).map(opt => (
                            <label key={opt} className="flex items-center gap-3 p-2">
                                <div className="w-5 h-5 border border-border bg-surface rounded-sm" />
                                <span className="text-sm">{opt}</span>
                            </label>
                        ))}
                        {(field.options?.length || 0) > 4 && <span className="text-xs text-muted ml-8">+{(field.options?.length || 0) - 4} more</span>}
                    </div>
                );

            case 'number':
                return <input type="number" disabled className={baseClass} placeholder="0.00" />;

            case 'date':
                return <input type="date" disabled className={baseClass} />;

            case 'file':
                return (
                    <div className="border-2 border-dashed border-border rounded-sm p-6 text-center opacity-50">
                        <p className="text-sm text-muted">Click to upload or drag and drop</p>
                    </div>
                );

            case 'address':
                return (
                    <div className="space-y-2">
                        <input type="text" disabled className={baseClass} placeholder="Street Address" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" disabled className={baseClass} placeholder="City" />
                            <input type="text" disabled className={baseClass} placeholder="State/Province" />
                        </div>
                    </div>
                );

            case 'rich-text':
                return (
                    <div className="border border-border rounded-sm p-3 bg-surface-highlight opacity-50">
                        <div className="flex gap-2 mb-2 pb-2 border-b border-border/50">
                            <div className="w-6 h-6 bg-border/30 rounded" />
                            <div className="w-6 h-6 bg-border/30 rounded" />
                            <div className="w-6 h-6 bg-border/30 rounded" />
                        </div>
                        <div className="min-h-[100px] text-muted/30">Rich text editor...</div>
                    </div>
                );

            default:
                return <input type="text" disabled className={baseClass} placeholder={`Enter ${field.name}...`} />;
        }
    };

    if (schema.length === 0) {
        return (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-surface/20">
                <div className="text-center text-muted">
                    <p className="text-sm">No fields to preview</p>
                    <p className="text-xs mt-2">Add fields to see the form preview</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-widest">Live Preview</h3>
                <span className="text-xs text-muted bg-surface px-2 py-1 rounded-sm">Read-only</span>
            </div>

            {Object.entries(groups).map(([group, fields], idx) => (
                <motion.div
                    key={group}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                >
                    <Card className="border-l-2 border-l-primary/50">
                        <CardHeader>
                            <CardTitle className="text-base">{group}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {fields.map(field => (
                                <div key={field.id} className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        {field.name}
                                        {field.required && <span className="text-red-400">*</span>}
                                        {field.notes && <span className="text-[10px] normal-case font-normal text-muted/50">— {field.notes}</span>}
                                    </label>
                                    <div className="relative">
                                        {renderPreviewInput(field)}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
