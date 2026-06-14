import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || url.searchParams.get('topic');
    const id = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (type === 'payment' && id) {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id });

      if (paymentInfo.status === 'approved') {
        const orderId = paymentInfo.external_reference;

        if (orderId) {
          await dbConnect();
          await Order.findByIdAndUpdate(orderId, {
            status: 'COMPLETED',
            payment_id: paymentInfo.id?.toString(),
          });
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in Mercado Pago webhook:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
