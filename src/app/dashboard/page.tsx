import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Download, Package } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Ensure Product model is registered for populate

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  await dbConnect();
  
  const orders = await Order.find({ 
    user_id: userId,
    status: 'COMPLETED'
  }).populate('product_id').sort({ createdAt: -1 });

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control</h1>
          <p className="text-gray-400 mt-1">Bienvenido, {user?.firstName || user?.emailAddresses[0].emailAddress}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Package className="w-5 h-5 text-[--accent-blue]" />
        Mis Compras
      </h2>

      {orders.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-4">Aún no tienes productos comprados.</p>
          <a href="/" className="inline-block bg-[--accent-green] text-black px-6 py-2 rounded-lg font-medium hover:bg-emerald-400 transition-colors">
            Explorar Catálogo
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const product = order.product_id as any;
            return (
              <div key={order._id.toString()} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-gray-700 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-white">{product?.name || 'Producto No Disponible'}</h3>
                  <p className="text-sm text-gray-400">Comprado el: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <a 
                  href={`/api/download/${order._id}`} 
                  className="flex items-center gap-2 bg-[--accent-blue] text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4" />
                  Descargar v{product?.version || '1.0'}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
