"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'primary' | 'outline' | 'surface' | 'success' | 'warning';
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
    const variants = {
        primary: "bg-primary text-primary-foreground border-transparent",
        outline: "border-primary text-primary bg-transparent",
        surface: "bg-surface-highlight text-foreground border-border",
        success: "bg-green-500/10 text-green-500 border-green-500/20",
        warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    }

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-sm border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}
