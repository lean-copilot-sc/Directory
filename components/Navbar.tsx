"use client"

import * as React from "react"
import { Button } from "./ui/button"
import Link from "next/link"
import { useDirectory } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronRight, Settings, Database, PlusCircle, LayoutList, User as UserIcon, Sun, Moon } from "lucide-react"

export function Navbar() {
    const { config, user, users, switchUser, theme, toggleTheme, logout } = useDirectory();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    if (!user) return null; // Or show a compact login button nav

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);



    const NavLinks = () => (
        <>
            {/* Admin Links */}
            {user.role === 'Admin' && (
                <>
                    <Link href="/admin/settings" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full md:w-auto justify-start border border-transparent md:border-none">
                            <Settings className="w-4 h-4 mr-2 md:hidden" /> Settings
                        </Button>
                    </Link>
                    <Link href="/admin/schema" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full md:w-auto justify-start border border-transparent md:border-none">
                            <Database className="w-4 h-4 mr-2 md:hidden" /> Schema
                        </Button>
                    </Link>
                    <Link href="/admin/users" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full md:w-auto justify-start border border-transparent md:border-none">
                            <UserIcon className="w-4 h-4 mr-2 md:hidden" /> Users
                        </Button>
                    </Link>
                </>
            )}

            {/* Owner/Admin Management */}
            {(user.role === 'Admin' || user.role === 'Owner') && (
                <Link href="/admin/listings" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full md:w-auto justify-start border border-transparent md:border-none">
                        <LayoutList className="w-4 h-4 mr-2 md:hidden" /> {user.role === 'Admin' ? 'All Listings' : 'My Listings'}
                    </Button>
                </Link>
            )}

            {/* Shared Creator Links */}
            {(user.role === 'Admin' || user.role === 'Owner') && (
                <Link href="/admin/new" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full md:w-auto justify-start border border-transparent md:border-none">
                        <PlusCircle className="w-4 h-4 mr-2 md:hidden" /> New Record
                    </Button>
                </Link>
            )}

            {/* User Action */}
            {user.role === 'User' && (
                <Button className="w-full md:w-auto">Join Now</Button>
            )}
        </>
    );

    return (
        <>
            <nav className="w-full border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Header Content */}
                    <div className="flex items-center justify-between w-full">
                        {/* Logo Section */}
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                            {config.logo ? (
                                <img src={config.logo} alt="Logo" className="h-10 w-auto object-contain" />
                            ) : (
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-primary rounded-sm rotate-45 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] group-hover:rotate-90 transition-transform duration-500" />
                                    <span className="text-xl font-serif font-bold tracking-widest text-primary ml-3 group-hover:text-primary-hover transition-colors hidden xs:inline">
                                        LUXE DIRECTORY
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Role Switcher (Desktop) */}
                            <div className="flex items-center gap-2 border-r border-border pr-4 mr-2">
                                <span className="text-[10px] uppercase text-muted tracking-wider ml-4">View:</span>
                                <select
                                    value={user.role}
                                    onChange={(e) => switchUser(e.target.value as any)}
                                    className="bg-surface-highlight border border-border text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary cursor-pointer text-foreground font-medium"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Owner">Owner</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                            <NavLinks />
                        </div>
                    </div>

                    {/* Mobile Toggle Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-primary z-[1001] hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay - MOVED OUTSIDE NAV TO FIX CONTAINING BLOCK ISSUE */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 bg-background z-[1000] md:hidden flex flex-col p-8 pt-28 overflow-y-auto"
                        style={{ height: '100vh', width: '100vw' }}
                    >
                        {/* Explicit Close Button Inside Overlay */}
                        <div className="absolute top-5 right-4 z-[1010] flex items-center gap-4">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors outline-none"
                                aria-label="Close Menu"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Elegant Backdrop Grain */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                        <div className="relative z-10 flex flex-col gap-10">
                            {/* Profile/Role Section */}
                            <div className="flex flex-col gap-6 p-6 bg-surface border border-border rounded-2xl shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <UserIcon className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[10px] uppercase text-primary tracking-[0.3em] font-bold">Currently Viewing As</span>
                                            <span className="text-xl font-serif text-foreground block">{user.name}</span>
                                            <span className="text-xs text-muted font-medium opacity-60 uppercase tracking-widest leading-none">{user.role}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] uppercase text-muted tracking-[0.2em]">Switch Perspective</p>
                                    <div className="flex flex-col gap-2">
                                        {['Admin', 'Owner', 'User'].map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => { switchUser(role as any); setIsMenuOpen(false); }}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${user.role === role
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]'
                                                    : 'bg-surface-highlight/30 text-muted border-border hover:border-primary/40'
                                                    }`}
                                            >
                                                <span className="text-sm font-bold tracking-wide">{role} View</span>
                                                {user.role === role && <ChevronRight className="w-4 h-4 ml-2" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Navigation Links */}
                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] uppercase text-muted tracking-[0.2em] mb-2 px-2 font-bold">Navigation</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {/* Direct Button Styles for NavLinks on Mobile */}
                                    {user.role === 'Admin' && (
                                        <>
                                            <Link href="/admin/settings" onClick={() => setIsMenuOpen(false)} className="group">
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/30 transition-all">
                                                    <Settings className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-wide">System Settings</span>
                                                </div>
                                            </Link>
                                            <Link href="/admin/schema" onClick={() => setIsMenuOpen(false)} className="group">
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/30 transition-all">
                                                    <Database className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-wide">Schema Builder</span>
                                                </div>
                                            </Link>
                                        </>
                                    )}
                                    {(user.role === 'Admin' || user.role === 'Owner') && (
                                        <>
                                            <Link href="/admin/listings" onClick={() => setIsMenuOpen(false)} className="group">
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/30 transition-all">
                                                    <LayoutList className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-wide">
                                                        {user.role === 'Admin' ? 'All Listings' : 'My Listings'}
                                                    </span>
                                                </div>
                                            </Link>
                                            <Link href="/admin/new" onClick={() => setIsMenuOpen(false)} className="group">
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/30 transition-all">
                                                    <PlusCircle className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-wide">Create Record</span>
                                                </div>
                                            </Link>
                                        </>
                                    )}
                                    {user.role === 'User' && (
                                        <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-widest shadow-lg shadow-primary/20">
                                            GET EXCLUSIVE ACCESS
                                        </button>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-8 text-red-500 border-red-500/20 hover:bg-red-500/10"
                                    onClick={() => { logout(); setIsMenuOpen(false); window.location.href = '/login'; }}
                                >
                                    Log Out
                                </Button>
                            </div>

                            {/* Footer Sign-off */}
                            <div className="mt-8 border-t border-border pt-8 text-center pb-10">
                                <p className="text-[10px] text-muted uppercase tracking-[0.5em] opacity-40">Luxe Directory &copy; 2026</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
