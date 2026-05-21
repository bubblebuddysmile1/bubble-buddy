export type CartProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category?: string;
  stockQuantity: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};
