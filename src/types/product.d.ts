export interface Product {
  _id: string;
  sellerId: string;
  title: string;
  description?: string;
  category?: {
    _id: string;
    name: string;
  };
  tags?: string[];
  price?: number;
  condition:
    | "Like New"
    | "Gently Used"
    | "Minor Scratches"
    | "Stains"
    | "Needs Repair";
  images?: string[];
  status?: "active" | "sold" | "removed";
  deliveryOptions?: Array<"Home Delivery" | "Pick Up">;
  createdAt: Date;
  updatedAt: Date;
}
