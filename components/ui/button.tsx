"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const baseStyles = "inline-flex items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

        const variants: Record<ButtonVariant, string> = {
            primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[0_0_10px_rgba(212,175,55,0.2)]",
            outline: "border border-primary text-primary hover:bg-primary/10",
            ghost: "text-primary hover:bg-primary/5"
        }

        const sizes: Record<ButtonSize, string> = {
            sm: "h-8 px-3 text-xs uppercase tracking-wider",
            md: "h-11 px-6 text-sm uppercase tracking-widest font-medium",
            lg: "h-14 px-8 text-base uppercase tracking-widest font-bold"
        }

        const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

        // If asChild is true, we use Slot which doesn't support motion props directly in the same way 
        // without wrapping or composing refs. For simplicity in this demo, if asChild is used, we lose the motion wrapper 
        // OR we can wrap the Slot in a motion.div (but that changes markup).
        // Let's stick to simple implementation: if asChild, standard rendering.

        if (asChild) {
            return (
                <Slot
                    className={combinedClassName}
                    ref={ref}
                    {...props}
                />
            )
        }

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={combinedClassName}
                {...props as HTMLMotionProps<"button">}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
