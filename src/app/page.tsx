import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { LayoutDashboard, Sparkles } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  await dbConnect();
  
  const products = await Product.find({ is_active: true }).sort({ createdAt: -1 });
  const user = await currentUser();
  const userId = user?.id;
  const isAdmin = user?.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL;
  return (
    <div className="min-h-screen text-white selection:bg-emerald-500/30">
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Mianlo<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Dev</span>
          </div>
          
          <div className="flex items-center gap-6">
            {userId ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 border-2 border-emerald-500/20" } }} />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/sign-up" className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full hover:scale-105 hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-24 max-w-7xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="text-center max-w-4xl mx-auto mb-32 relative z-10 animate-float">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Arquitecturas Listas para Producción
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
            Premium Software <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 bg-[length:200%_auto] animate-gradient">Marketplace</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Descubre y adquiere proyectos de software de clase mundial. Integración inmediata, código impoluto y actualizaciones garantizadas para elevar tu negocio al siguiente nivel.
          </p>
        </div>

        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Catálogo Exclusivo</h2>
          <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-grow ml-8"></div>
        </div>

        {products.length === 0 ? (
          <div className="text-center p-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Nuestro catálogo se está actualizando. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id.toString()}
                id={product._id.toString()}
                name={product.name}
                description={product.description}
                version={product.version}
                price={product.price}
                demoUrl={product.demo_url}
              />
            ))}
          </div>
        )}
      </main>
      
      <footer className="border-t border-white/5 mt-32 py-12 text-center text-gray-600 text-sm bg-black/50 backdrop-blur-md">
        <p className="flex items-center justify-center gap-2">
          © {new Date().getFullYear()} Mianlo<span className="text-emerald-500 font-bold">Dev</span>. Construido con estándares premium.
        </p>
      </footer>
    </div>
  );
}
