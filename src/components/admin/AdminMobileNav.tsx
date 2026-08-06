"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 flex gap-2 overflow-x-auto border-b border-border bg-card/95 px-3 py-3 backdrop-blur md:hidden">
      <div className="flex min-w-max gap-2">
        {ADMIN_NAV_ITEMS.filter((item) => !item.external).map((item) => {
          const active = isActivePath(pathname, item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
