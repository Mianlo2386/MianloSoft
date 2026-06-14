import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';
import Order from '@/models/Order';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { productId } = await req.json();

    await dbConnect();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const order = await Order.create({
      user_id: userId,
      product_id: product._id,
      status: 'PENDING',
    });

    const preference = new Preference(client);
    const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const response = await preference.create({
      body: {
        items: [
          {
            id: product._id.toString(),
            title: product.name,
            quantity: 1,
            unit_price: product.price,
            currency_id: 'ARS',
          }
        ],
        external_reference: order._id.toString(),
        back_urls: {
          success: `${host}/dashboard?success=true`,
          failure: `${host}/dashboard?success=false`,
          pending: `${host}/dashboard?success=pending`,
        },
        auto_return: 'approved',
        notification_url: `${host}/api/webhooks/mercadopago`,
      }
    });

    return NextResponse.json({ init_point: response.sandbox_init_point });
  } catch (error) {
    console.error('Error in checkout:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
