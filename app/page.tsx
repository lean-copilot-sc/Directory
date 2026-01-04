"use client"
import { Navbar } from "@/components/Navbar";
import { DirectoryListing } from "@/components/DirectoryListing";
import { useDirectory } from "@/lib/store";

export default function Home() {
  const { records, schema, config, user } = useDirectory();

  // Access Control Logic
  const isAccessAllowed = config.anonymousAccess || user.role === 'Admin' || user.role === 'Owner';

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black relative">
      {/* Background Hero Image or Noise */}
      {config.heroImage ? (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url('${config.heroImage}')` }}
        />
      ) : (
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
      )}

      {/* Gradient Overlay for Readability if Hero is active */}
      {config.heroImage && (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/90 via-background/80 to-background pointer-events-none" />
      )}

      <div className="relative z-10">
        <Navbar />
        {isAccessAllowed ? (
          <DirectoryListing initialRecords={records} schema={schema} config={config} />
        ) : (
          <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface border border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <h1 className="text-4xl font-serif text-white mb-4">Private Directory</h1>
            <p className="text-muted max-w-md mb-8">
              This directory is currently restricted to members only. Please log in or contact an administrator to request access.
            </p>
            <button className="bg-primary text-black px-6 py-2 rounded-sm font-medium hover:bg-primary/90 transition-colors">
              Member Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
