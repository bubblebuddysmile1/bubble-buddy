import {
  FolderTree,
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
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Product images", href: "/admin/products/images", icon: ImageIcon },
  { label: "Orders", href: "/orders", icon: ShoppingBag, external: true },
  { label: "View store", href: "/", icon: Store, external: true },
];
