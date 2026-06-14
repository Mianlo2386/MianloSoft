"use client";

import { ExternalLink, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductProps {
  id: string;
  name: string;
  description: string;
  version: string;
  price: number;
  demoUrl?: string;
}

export default function ProductCard({ id, name, description, version, price, demoUrl }: ProductProps) {
  const router = useRouter();

  const handleBuy = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("Error iniciando pago", error);
    }
  };

  return (
    <div className="group relative bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col h-full hover:border-emerald-500/50 hover:bg-white/[0.02] transition-all duration-500 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-white tracking-tight">{name}</h3>
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1.5 rounded-full font-mono font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          v{version}
        </span>
      </div>
      
      <p className="relative z-10 text-gray-400 mb-8 flex-grow leading-relaxed font-light">{description}</p>
      
      <ul className="relative z-10 space-y-3 mb-8">
        {['Acceso de por vida', 'Actualizaciones garantizadas'].map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Inversión</span>
          <span className="text-3xl font-black text-white">${price.toFixed(2)}</span>
        </div>
        
        <div className="flex gap-3">
          {demoUrl && (
            <a 
              href={demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all hover:scale-105 flex items-center justify-center"
              title="Ver Demo en Vivo"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          <button 
            onClick={handleBuy}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            Adquirir
          </button>
        </div>
      </div>
    </div>
  );
}
