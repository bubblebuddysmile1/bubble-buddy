import {
  ImageIcon,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  external?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Product images", href: "/admin/products", icon: ImageIcon },
  { label: "All products", href: "/shop", icon: Package, external: true },
  { label: "Orders", href: "/orders", icon: ShoppingBag, external: true },
  { label: "View store", href: "/", icon: Store, external: true },
];
