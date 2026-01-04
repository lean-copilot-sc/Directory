import { Button } from "./ui/button";
import Link from "next/link";
import { useDirectory } from "@/lib/store";

export function Navbar() {
    const { config, user, switchUser } = useDirectory();

    return (
        <nav className="w-full border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    {config.logo ? (
                        <img src={config.logo} alt="Logo" className="h-10 w-auto object-contain" />
                    ) : (
                        <>
                            <div className="w-8 h-8 bg-primary rounded-sm rotate-45 shadow-[0_0_10px_#D4AF37] group-hover:rotate-90 transition-transform duration-500" />
                            <span className="text-xl font-serif font-bold tracking-widest text-primary ml-2 group-hover:text-primary-hover transition-colors">LUXE DIRECTORY</span>
                        </>
                    )}
                </Link>
                <div className="flex gap-4 items-center">
                    {/* Role Switcher (Debug) */}
                    <div className="flex items-center gap-2 border-r border-border pr-4 mr-2 hidden lg:flex">
                        <span className="text-[10px] uppercase text-muted tracking-wider">View:</span>
                        <select
                            value={user.role}
                            onChange={(e) => switchUser(e.target.value as any)}
                            className="bg-surface-highlight border border-border text-xs rounded-sm px-2 py-1 focus:outline-none focus:border-primary cursor-pointer text-foreground"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Owner">Owner</option>
                            <option value="User">User</option>
                        </select>
                    </div>

                    {/* Admin Links */}
                    {user.role === 'Admin' && (
                        <>
                            <Link href="/admin/settings">
                                <Button variant="ghost" size="sm">Settings</Button>
                            </Link>
                            <Link href="/admin/schema">
                                <Button variant="ghost" size="sm">Schema</Button>
                            </Link>
                        </>
                    )}

                    {/* Owner Links */}
                    {user.role === 'Owner' && (
                        <Link href="/admin/listings">
                            <Button variant="ghost" size="sm">My Listings</Button>
                        </Link>
                    )}

                    {/* Shared Creator Links */}
                    {(user.role === 'Admin' || user.role === 'Owner') && (
                        <Link href="/admin/new">
                            <Button variant="ghost" size="sm">New Record</Button>
                        </Link>
                    )}

                    {/* User Action */}
                    {user.role === 'User' && (
                        <Button>Join Now</Button>
                    )}
                </div>
            </div>
        </nav>
    )
}
