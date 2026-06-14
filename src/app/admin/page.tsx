"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, PlusCircle, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      version: formData.get("version"),
      price: formData.get("price"),
      demo_url: formData.get("demo_url"),
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Error al crear el producto");
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white py-24 px-6 selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <PlusCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Nuevo Proyecto</h1>
            <p className="text-gray-400 mt-1">Sube un nuevo activo al catálogo de MianloDev</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle background glow inside form */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              ¡Producto publicado con éxito en el catálogo!
            </div>
          )}

          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Proyecto</label>
              <input 
                name="name" 
                required 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
                placeholder="Ej. E-Commerce Pro" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Descripción Corta</label>
              <textarea 
                name="description" 
                required 
                rows={3} 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none" 
                placeholder="Plataforma de comercio electrónico con Next.js y Stripe..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Versión</label>
                <input 
                  name="version" 
                  required 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
                  placeholder="1.0.0" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Precio (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
                    placeholder="99.00" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL de Demo (Opcional)</label>
              <input 
                name="demo_url" 
                type="url" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" 
                placeholder="https://mi-demo.vercel.app" 
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black px-8 py-3.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Publicando..." : "Publicar Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
