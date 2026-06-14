import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  version: string;
  price: number;
  demo_url: string;
  file_path: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    version: { type: String, required: true },
    price: { type: Number, required: true },
    demo_url: { type: String, required: false },
    file_path: { type: String, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
