import {
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Tag,
  Users,
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
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Promotions", href: "/admin/promotions", icon: Tag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "View store", href: "/", icon: Store, external: true },
];
