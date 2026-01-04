"use client"
import { Navbar } from "@/components/Navbar";
import { useDirectory } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
    const { config, updateConfig, resetConfig, user } = useDirectory();
    // Local state for form until save
    const [localConfig, setLocalConfig] = useState(config);

    if (user.role !== 'Admin') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
                <h1 className="text-3xl font-serif text-white mb-2 z-10">Restricted Access</h1>
                <p className="text-muted max-w-md mb-8 z-10">
                    Only Administrators can configure system settings.
                </p>
                <div className="z-10">
                    <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        )
    }

    const handleSave = () => {
        updateConfig(localConfig);
        alert("System Configuration Saved!");
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
            <div className="relative z-10">
                <Navbar />
                <main className="container mx-auto px-4 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-border pb-6">
                        <div>
                            <h1 className="text-3xl font-serif text-white tracking-wide">System Settings</h1>
                            <p className="text-muted mt-2 text-sm">Configure global appearance and access rules.</p>
                        </div>
                        <Button onClick={handleSave} size="lg">
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="bg-surface/50 backdrop-blur border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> Branding & content</CardTitle>
                                <CardDescription>Customize the look and feel of the directory.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-muted">Logo URL</label>
                                    <input
                                        value={localConfig.logo}
                                        onChange={(e) => setLocalConfig({ ...localConfig, logo: e.target.value })}
                                        className="w-full bg-surface-highlight border border-border rounded-sm px-4 py-3 focus:border-primary focus:outline-none"
                                    />
                                    <img src={localConfig.logo} alt="Logo Preview" className="h-8 object-contain mt-2 border border-border p-1 bg-black/50" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-muted">Hero Image URL</label>
                                    <input
                                        value={localConfig.heroImage}
                                        onChange={(e) => setLocalConfig({ ...localConfig, heroImage: e.target.value })}
                                        className="w-full bg-surface-highlight border border-border rounded-sm px-4 py-3 focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-muted">Hero Text</label>
                                    <input
                                        value={localConfig.heroText}
                                        onChange={(e) => setLocalConfig({ ...localConfig, heroText: e.target.value })}
                                        className="w-full bg-surface-highlight border border-border rounded-sm px-4 py-3 focus:border-primary focus:outline-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-surface/50 backdrop-blur border-border/50">
                            <CardHeader>
                                <CardTitle>Access & Behaviors</CardTitle>
                                <CardDescription>Manage user roles and default views.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 border border-border rounded-sm bg-surface-highlight/30">
                                    <div>
                                        <h4 className="font-medium text-foreground">Anonymous Access</h4>
                                        <p className="text-xs text-muted mt-1">Allow unauthenticated users to view the directory.</p>
                                    </div>
                                    <Toggle
                                        checked={localConfig.anonymousAccess}
                                        onChange={(v) => setLocalConfig({ ...localConfig, anonymousAccess: v })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-muted">Default Layout</label>
                                    <div className="flex gap-4">
                                        {(['Grid', 'List'] as const).map(layout => (
                                            <div
                                                key={layout}
                                                onClick={() => setLocalConfig({ ...localConfig, defaultLayout: layout })}
                                                className={`
                                                    cursor-pointer px-6 py-3 rounded-sm border text-sm font-medium transition-all
                                                    ${localConfig.defaultLayout === layout
                                                        ? 'bg-primary text-black border-primary'
                                                        : 'bg-surface border-border text-muted hover:border-border/80'}
                                                `}
                                            >
                                                {layout} View
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border mt-8">
                                    <label className="text-xs uppercase tracking-wider text-muted mb-4 block">Danger Zone</label>
                                    <Button variant="outline" className="w-full border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300"
                                        onClick={() => {
                                            if (confirm("Are you sure? This will reset your theme, logo, and access settings to the system defaults.")) {
                                                resetConfig();
                                                // We need to reload to get fresh state or update localConfig
                                                window.location.reload();
                                            }
                                        }}
                                    >
                                        Reset to System Defaults
                                    </Button>
                                    <p className="text-[10px] text-muted mt-2">Clears locally saved configuration and restores settings from code (mockData).</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Temporary inline toggle until I extract it
function Toggle({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-border'}`}
        >
            <div className={`w-4 h-4 bg-black rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    )
}
