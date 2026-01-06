"use client"

import * as React from "react"
import { useDirectory } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
    const { login, config, user } = useDirectory();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    // Redirect if already logged in (simulated as this is a single page app context usually, but we have routes)
    // For now, just show the form.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                window.location.href = '/'; // Simple redirect to home
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-surface border border-border rounded-lg shadow-2xl p-8 md:p-10 relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif text-foreground mb-3 tracking-wide">Welcome Back</h1>
                        <p className="text-muted text-xs uppercase tracking-[0.2em]">Enter your credentials to access the directory</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@luxedir.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 text-red-500 bg-red-500/5 p-3 rounded-sm border border-red-500/20 text-xs"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            className="w-full shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    AUTHENTICATING...
                                </>
                            ) : (
                                "SIGN IN"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-border/50">
                        <div className="grid grid-cols-1 gap-4 text-center">
                            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Initial Demo Credentials</p>
                            <div className="space-y-2">
                                <p className="text-[10px] text-muted/60">Admin: admin@luxedir.com / Admin@Luxe2026</p>
                                <p className="text-[10px] text-muted/60">Owner: owner@luxedir.com / Owner@Luxe2026</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-xs text-muted">
                        Don't have an account? <span className="text-primary hover:underline cursor-pointer">Request Access</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
