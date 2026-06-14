import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';

// Add the Next.js API type to prevent type errors
export async function GET(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Await params in Next.js 15
    const params = await props.params;
    const { orderId } = params;

    await dbConnect();
    const order = await Order.findOne({ _id: orderId, user_id: userId }).populate('product_id');

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    if (order.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'El pago no ha sido completado' }, { status: 402 });
    }

    const product = order.product_id as any;

    // MOCK: Generación de Signed URL. Cuando configures S3/Supabase, reemplazar por la API correspondiente.
    const mockSignedUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mock-downloads/${product.file_path}?token=mock_secure_token_${Date.now()}`;

    return NextResponse.redirect(mockSignedUrl);
  } catch (error) {
    console.error('Error in download endpoint:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
