"use client"

import * as React from "react"
import { Field } from "@/lib/types"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { motion, Reorder, useDragControls } from "framer-motion"
import { Plus, Trash2, GripVertical, Settings, Save } from "lucide-react"

interface SchemaBuilderProps {
    initialSchema: Field[];
    onSave: (schema: Field[]) => void;
}

export function SchemaBuilder({ initialSchema, onSave }: SchemaBuilderProps) {
    const [fields, setFields] = React.useState<Field[]>(initialSchema);
    const [activeFieldId, setActiveFieldId] = React.useState<string | null>(null);

    // Derived state for the currently active field
    const activeField = React.useMemo(() =>
        fields.find(f => f.id === activeFieldId),
        [fields, activeFieldId]);

    const addField = () => {
        const newField: Field = {
            id: `field_${Date.now()}`,
            name: "New Field",
            type: "text",
            group: "General",
            navigable: false,
            filterable: false,
            sortable: false,
            required: false,
            displayInListing: false
        };
        setFields([...fields, newField]);
        setActiveFieldId(newField.id);
    };

    const updateField = (id: string, updates: Partial<Field>) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id));
        if (activeFieldId === id) setActiveFieldId(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Field List */}
            <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif text-white">Form Fields</h2>
                    <Button onClick={addField} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Add
                    </Button>
                </div>

                <Reorder.Group
                    axis="y"
                    values={fields}
                    onReorder={setFields}
                    className="space-y-2"
                >
                    {fields.map((field, idx) => (
                        <Reorder.Item
                            key={field.id}
                            value={field}
                            className={`
                                p-4 rounded-sm border cursor-grab active:cursor-grabbing transition-all flex items-center justify-between group
                                ${activeFieldId === field.id
                                    ? 'bg-primary/20 border-primary'
                                    : 'bg-surface border-border hover:border-primary/50'}
                            `}
                            onClick={() => setActiveFieldId(field.id)}
                            whileDrag={{
                                scale: 1.05,
                                boxShadow: "0 10px 30px rgba(212, 175, 55, 0.3)",
                                zIndex: 999
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical className="w-4 h-4 text-muted/50 cursor-grab active:cursor-grabbing" />
                                <span className="text-muted/50 font-mono text-xs">{idx + 1}</span>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{field.name}</p>
                                    <p className="text-[10px] uppercase text-muted tracking-wider">{field.type}</p>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Settings className="w-4 h-4 text-muted hover:text-primary" />
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                <div className="pt-6 border-t border-border">
                    <Button className="w-full" size="lg" onClick={() => onSave(fields)}>
                        <Save className="w-4 h-4 mr-2" /> Save Schema
                    </Button>
                </div>
            </div>

            {/* Field Editor */}
            <div className="lg:col-span-2">
                {activeField && activeFieldId ? (
                    <Card className="bg-surface/50 backdrop-blur-sm sticky top-24 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                            <div>
                                <CardTitle>Edit Field</CardTitle>
                                <p className="text-xs text-primary font-mono mt-1">{activeFieldId}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeField(activeFieldId)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-muted tracking-wider">Field Label</label>
                                    <input
                                        value={activeField.name}
                                        onChange={(e) => updateField(activeFieldId, { name: e.target.value })}
                                        className="w-full bg-surface-highlight border border-border rounded-sm px-3 py-2 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-muted tracking-wider">Data Type</label>
                                    <select
                                        value={activeField.type}
                                        onChange={(e) => updateField(activeFieldId, { type: e.target.value as any })}
                                        className="w-full bg-surface-highlight border border-border rounded-sm px-3 py-2 focus:border-primary focus:outline-none text-sm"
                                    >
                                        <option value="text">Text (Single Line)</option>
                                        <option value="textarea">Text (Multiple Lines)</option>
                                        <option value="rich-text">Rich Text (WYSIWYG)</option>
                                        <option value="number">Number</option>
                                        <option value="choice-select">Choice (Dropdown)</option>
                                        <option value="choice-radio">Choice (Radio)</option>
                                        <option value="choice-checkbox">Choice (Checkbox)</option>
                                        <option value="date">Date</option>
                                        <option value="file">File Upload</option>
                                        <option value="address">Address / Map</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">UI Grouping</label>
                                <input
                                    value={activeField.group || ''}
                                    onChange={(e) => updateField(activeFieldId, { group: e.target.value })}
                                    className="w-full bg-surface-highlight border border-border rounded-sm px-3 py-2 focus:border-primary focus:outline-none"
                                    placeholder="e.g. Location Details, Performance..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Page (Multi-page Forms)</label>
                                <input
                                    value={activeField.page || ''}
                                    onChange={(e) => updateField(activeFieldId, { page: e.target.value })}
                                    className="w-full bg-surface-highlight border border-border rounded-sm px-3 py-2 focus:border-primary focus:outline-none"
                                    placeholder="e.g. Basic Info, Advanced Settings..."
                                />
                                <p className="text-[10px] text-muted/50">Leave empty for single-page form</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted tracking-wider">Note to User</label>
                                <input
                                    value={activeField.notes || ''}
                                    onChange={(e) => updateField(activeFieldId, { notes: e.target.value })}
                                    className="w-full bg-surface-highlight border border-border rounded-sm px-3 py-2 focus:border-primary focus:outline-none"
                                    placeholder="Explanation shown on form..."
                                />
                            </div>

                            {/* Options for Choice Types */}
                            {['choice-radio', 'choice-checkbox', 'choice-select'].includes(activeField.type) && (
                                <div className="space-y-2 p-4 bg-surface-highlight/50 rounded-md border border-border/50">
                                    <label className="text-xs uppercase text-muted tracking-wider">Options (Comma separated)</label>
                                    <textarea
                                        value={activeField.options?.join(', ')}
                                        onChange={(e) => updateField(activeFieldId, { options: e.target.value.split(',').map(s => s.trim()) })}
                                        className="w-full bg-surface border border-border rounded-sm px-3 py-2 focus:border-primary focus:outline-none h-20 text-sm"
                                        placeholder="Option 1, Option 2, Option 3"
                                    />
                                </div>
                            )}

                            {/* Date/Time Configuration */}
                            {activeField.type === 'date' && (
                                <div className="space-y-4 p-4 bg-surface-highlight/50 rounded-md border border-border/50">
                                    <label className="text-xs uppercase text-muted tracking-wider">Date/Time Options</label>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={activeField.dateConfig?.includeTime || false}
                                                onChange={(e) => updateField(activeFieldId, {
                                                    dateConfig: { ...activeField.dateConfig, includeTime: e.target.checked }
                                                })}
                                                className="w-4 h-4 rounded border-border bg-surface accent-primary cursor-pointer"
                                            />
                                            <span className="text-sm">Include Time</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={activeField.dateConfig?.defaultToToday || false}
                                                onChange={(e) => updateField(activeFieldId, {
                                                    dateConfig: { ...activeField.dateConfig, defaultToToday: e.target.checked }
                                                })}
                                                className="w-4 h-4 rounded border-border bg-surface accent-primary cursor-pointer"
                                            />
                                            <span className="text-sm">Default to Today's Date</span>
                                        </label>

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-muted tracking-wider">Date Format</label>
                                            <select
                                                value={activeField.dateConfig?.format || 'YYYY-MM-DD'}
                                                onChange={(e) => updateField(activeFieldId, {
                                                    dateConfig: { ...activeField.dateConfig, format: e.target.value as any }
                                                })}
                                                className="w-full bg-surface border border-border rounded-sm px-3 py-2 focus:border-primary focus:outline-none text-sm"
                                            >
                                                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-01-15)</option>
                                                <option value="MM/DD/YYYY">MM/DD/YYYY (01/15/2024)</option>
                                                <option value="DD/MM/YYYY">DD/MM/YYYY (15/01/2024)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Toggles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                                <Toggle
                                    label="Required"
                                    desc="Mandatory field"
                                    checked={!!activeField.required}
                                    onChange={(v) => updateField(activeFieldId, { required: v })}
                                />
                                <Toggle
                                    label="Show in Listing"
                                    desc="Visible on card"
                                    checked={!!activeField.displayInListing}
                                    onChange={(v) => updateField(activeFieldId, { displayInListing: v })}
                                />
                                <Toggle
                                    label="Navigable"
                                    desc="Show in sidebar filters"
                                    checked={!!activeField.navigable}
                                    onChange={(v) => updateField(activeFieldId, { navigable: v })}
                                />
                                <Toggle
                                    label="Filterable"
                                    desc="Allow user filtering"
                                    checked={!!activeField.filterable}
                                    onChange={(v) => updateField(activeFieldId, { filterable: v })}
                                />
                                <Toggle
                                    label="Sortable"
                                    desc="Enable sorting"
                                    checked={!!activeField.sortable}
                                    onChange={(v) => updateField(activeFieldId, { sortable: v })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-surface/20">
                        <div className="text-center text-muted">
                            <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Select a field to configure properties</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function Toggle({ label, desc, checked, onChange }: { label: string, desc: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`
                text-left w-full cursor-pointer p-3 rounded-sm border transition-all select-none focus:outline-none focus:ring-1 focus:ring-primary
                ${checked ? 'bg-primary/10 border-primary' : 'bg-surface border-border hover:border-border/80'}
            `}
        >
            <div className="flex items-center justify-between mb-1">
                <span className={`font-medium text-sm ${checked ? 'text-primary' : 'text-foreground'}`}>{label}</span>
                <div className={`w-3 h-3 rounded-full transition-colors ${checked ? 'bg-primary shadow-[0_0_8px_#D4AF37]' : 'bg-border'}`} />
            </div>
            <p className="text-[10px] text-muted">{desc}</p>
        </button>
    )
}
