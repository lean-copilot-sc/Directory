"use client"

import * as React from "react"
import { Button } from "./ui/button"
import { Download, Upload } from "lucide-react"
import { DirectoryRecord } from "@/lib/types"
import { useDirectory } from "@/lib/store"

interface ExportImportProps {
    records: DirectoryRecord[];
    onImport: (records: DirectoryRecord[]) => void;
}

export function ExportImport({ records, onImport }: ExportImportProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { showAlert } = useDirectory();

    const handleExport = () => {
        const dataStr = JSON.stringify(records, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `directory-records-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedRecords = JSON.parse(event.target?.result as string);
                if (Array.isArray(importedRecords)) {
                    onImport(importedRecords);
                    showAlert(
                        "Import Accomplished",
                        `Successfully synchronized ${importedRecords.length} records into your local directory database.`,
                        "success"
                    );
                } else {
                    showAlert(
                        "Structure Mismatch",
                        "The provided file does not match the required Luxe Directory schema. Please verify the JSON source.",
                        "danger"
                    );
                }
            } catch (error) {
                showAlert(
                    "Parsing Interrupted",
                    "The system encountered an error decyphering the JSON file. Ensure the file is not corrupted.",
                    "danger"
                );
            }
        };
        reader.readAsText(file);

        // Reset input so the same file can be selected again
        e.target.value = '';
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                onClick={handleExport}
                className="w-44 gap-2"
            >
                <Download className="w-4 h-4" />
                Export ({records.length})
            </Button>
            <Button
                variant="outline"
                onClick={handleImportClick}
                className="w-44 gap-2"
            >
                <Upload className="w-4 h-4" />
                Import
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
