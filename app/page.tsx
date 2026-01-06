"use client"
import { Navbar } from "@/components/Navbar";
import { DirectoryListing } from "@/components/DirectoryListing";
import { useDirectory } from "@/lib/store";

export default function Home() {
  const { records, schema, config } = useDirectory();

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
        <DirectoryListing initialRecords={records} schema={schema} config={config} />
      </div>
    </div>
  );
}
