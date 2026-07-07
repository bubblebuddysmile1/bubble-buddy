import {
  Activity,
  BarChart3,
  Database,
  Download,
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  MessageSquareText,
  Package,
  ShoppingBag,
  Store,
  Tag,
  TrendingUp,
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
  {label: "Reviews", href: "/admin/reviews", icon: ImageIcon },
  { label: "Contact Messages", href: "/admin/contact-messages", icon: MessageSquareText },
  {label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  {label: "Sales charts", href: "/admin/sales-charts", icon: BarChart3 },
  {label: "Revenue", href: "/admin/revenue-reports", icon: BarChart3 },
  {label: "Best Selling", href: "/admin/best-selling-products", icon: TrendingUp },
  {label: "Inventory", href: "/admin/inventory-reports", icon: Database },
  {label: "Export Reports", href: "/admin/export-reports", icon: Download },
  {label: "Activity Logs", href: "/admin/activity-logs", icon: Activity },
  {label: "Admin Metrics", href: "/admin/admin-metrics", icon: Activity },
  { label: "View store", href: "/", icon: Store, external: true },
];
