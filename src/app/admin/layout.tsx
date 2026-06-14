import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!user || userEmail !== process.env.ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 text-white selection:bg-emerald-500/30">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">Acceso Restringido</h1>
        <p className="text-lg text-gray-400 mb-10 max-w-md font-light leading-relaxed">
          Esta área es una zona de máxima seguridad reservada exclusivamente para la administración del catálogo de MianloDev.
        </p>
        <Link href="/" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
