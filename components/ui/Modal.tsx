"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, CheckCircle, Info, AlertOctagon } from "lucide-react"
import { Button } from "./button"

export type ModalType = 'info' | 'success' | 'warning' | 'danger';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    description: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    type = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showCancel = true
}: ModalProps) {

    // Auto-close success after 3 seconds if it's just an alert
    React.useEffect(() => {
        if (isOpen && type === 'success' && !onConfirm) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, type, onClose, onConfirm]);

    const icons = {
        info: <Info className="w-10 h-10 text-blue-400" />,
        success: <CheckCircle className="w-10 h-10 text-emerald-400" />,
        warning: <AlertTriangle className="w-10 h-10 text-amber-400" />,
        danger: <AlertOctagon className="w-10 h-10 text-red-500" />
    };

    const colors = {
        info: 'border-blue-500/20 shadow-blue-500/10',
        success: 'border-emerald-500/20 shadow-emerald-500/10',
        warning: 'border-amber-500/20 shadow-amber-500/10',
        danger: 'border-red-500/20 shadow-red-500/10'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`
                            relative w-full max-w-md bg-surface border rounded-xl overflow-hidden shadow-2xl z-10
                            ${colors[type]}
                        `}
                    >
                        {/* Top Grain Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                        {/* Dynamic Accent Bar */}
                        <div className={`
                            absolute top-0 left-0 right-0 h-1
                            ${type === 'danger' ? 'bg-red-500' : type === 'warning' ? 'bg-amber-500' : type === 'success' ? 'bg-emerald-500' : 'bg-primary'}
                        `} />

                        <div className="p-8">
                            <div className="flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                                    className="mb-4"
                                >
                                    {icons[type]}
                                </motion.div>

                                <h2 className="text-2xl font-serif text-foreground mb-2 tracking-wide">{title}</h2>
                                <p className="text-muted text-sm leading-relaxed mb-8">
                                    {description}
                                </p>

                                <div className="flex gap-3 w-full">
                                    {showCancel && (
                                        <Button
                                            variant="outline"
                                            onClick={onClose}
                                            className="flex-1 h-12"
                                        >
                                            {cancelText}
                                        </Button>
                                    )}
                                    <Button
                                        variant={type === 'danger' ? 'outline' : 'primary'}
                                        onClick={() => {
                                            if (onConfirm) onConfirm();
                                            else onClose();
                                        }}
                                        className={`flex-1 h-12 ${type === 'danger' ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : ''}`}
                                    >
                                        {confirmText}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
