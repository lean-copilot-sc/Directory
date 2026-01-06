"use client"

import * as React from "react"
import { useDirectory } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Search, Edit2, Trash2, Mail, Shield, User as UserIcon, X, Check, MoreHorizontal, ArrowLeft } from "lucide-react"
import { User, Role } from "@/lib/types"
import Link from "next/link"

export default function UserManagementPage() {
    const { user, users, addUser, updateUser, deleteUser, showConfirm } = useDirectory();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState<User | null>(null);

    // Form State
    const [formData, setFormData] = React.useState<Partial<User>>({
        name: '',
        email: '',
        role: 'User',
        password: '',
        isActive: true
    });

    // Guard: Only admins allowed
    if (user?.role !== 'Admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Shield className="w-16 h-16 text-primary opacity-20" />
                <h1 className="text-2xl font-serif text-foreground">Access Restricted</h1>
                <p className="text-muted text-sm">You do not have permission to manage users.</p>
                <Button onClick={() => window.location.href = '/'}>Return Home</Button>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenForm = (userToEdit?: User) => {
        if (userToEdit) {
            setEditingUser(userToEdit);
            setFormData(userToEdit);
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'User', password: '', isActive: true });
        }
        setIsFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            updateUser({ ...editingUser, ...formData } as User);
        } else {
            const newUser: User = {
                ...formData,
                id: `user-${Date.now()}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
            } as User;
            addUser(newUser);
        }
        setIsFormOpen(false);
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings">
                        <Button variant="ghost" size="sm" className="p-2 h-10 w-10 rounded-full border border-border hover:bg-primary/10 hover:text-primary transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-serif text-foreground mb-2">User Management</h1>
                        <p className="text-muted text-sm uppercase tracking-widest">Create, monitor and manage system access</p>
                    </div>
                </div>
                <Button onClick={() => handleOpenForm()} className="gap-2 shadow-lg shadow-primary/20">
                    <UserPlus className="w-4 h-4" /> Add New User
                </Button>
            </header>

            {/* Actions Bar */}
            <div className="bg-surface border border-border rounded-lg p-4 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                        placeholder="Search users by name or email..."
                        className="pl-10 bg-background/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Badge variant="surface" className="h-11 px-4 flex items-center justify-center">Total: {users.length}</Badge>
                    <Badge variant="success" className="h-11 px-4 flex items-center justify-center">Active: {users.filter(u => u.isActive).length}</Badge>
                </div>
            </div>

            {/* Users List (Modern Grid/Card view for better responsiveness) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredUsers.map((u) => (
                        <motion.div
                            key={u.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface border border-border rounded-lg p-6 hover:border-primary/40 transition-all group relative overflow-hidden"
                        >
                            {/* Role Badge Overlay */}
                            <div className="absolute top-4 right-4">
                                <Badge variant={u.role === 'Admin' ? 'primary' : u.role === 'Owner' ? 'outline' : 'surface'}>
                                    {u.role}
                                </Badge>
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-surface-highlight border border-border overflow-hidden p-1">
                                    <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt={u.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold tracking-tight text-foreground truncate">{u.name}</h3>
                                    <div className="flex items-center text-muted text-xs gap-1 mt-1 truncate">
                                        <Mail className="w-3 h-3" /> {u.email}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-[10px] uppercase tracking-widest text-muted">{u.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleOpenForm(u)}
                                    >
                                        <Edit2 className="w-4 h-4 text-primary" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-red-500/10"
                                        onClick={() => {
                                            showConfirm(
                                                "Remove User Portfolio?",
                                                `Are you sure you want to delete ${u.name}'s account? This action cannot be undone.`,
                                                () => deleteUser(u.id),
                                                'danger'
                                            );
                                        }}
                                        disabled={u.id === user.id} // Cannot delete self
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal Overlay (Simple Custom Implementation) */}
            <AnimatePresence>
                {isFormOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-border rounded-lg shadow-2xl z-[101] p-8"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-serif text-foreground">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                                <button onClick={() => setIsFormOpen(false)} className="text-muted hover:text-foreground transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        placeholder="John Luxury"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        placeholder="user@luxedir.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                {!editingUser && (
                                    <div className="space-y-2">
                                        <Label>Initial Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>System Role</Label>
                                    <select
                                        className="w-full h-11 bg-background border border-border rounded-sm px-3 text-sm focus:outline-none focus:border-primary text-foreground"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                    >
                                        <option value="User">User</option>
                                        <option value="Owner">Owner</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        className="rounded-sm border-border bg-background text-primary focus:ring-primary"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <Label htmlFor="isActive" className="mb-0 cursor-pointer">Active Account</Label>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)} className="flex-1">Cancel</Button>
                                    <Button type="submit" className="flex-1">{editingUser ? 'Update User' : 'Create User'}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
