import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  user_id: string; // Clerk User ID
  product_id: mongoose.Types.ObjectId;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  payment_id?: string;
  download_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    user_id: { type: String, required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
    payment_id: { type: String, required: false },
    download_url: { type: String, required: false },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
