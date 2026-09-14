export type CartProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  image: string;
  category?: string;
  stockQuantity: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};
