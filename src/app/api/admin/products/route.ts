import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!user || userEmail !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, version, price, demo_url } = body;

    if (!name || !description || !version || price === undefined) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    await dbConnect();

    const newProduct = await Product.create({
      name,
      description,
      version,
      price: Number(price),
      demo_url,
      is_active: true, // Por defecto activo al crear
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
