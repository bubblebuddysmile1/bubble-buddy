"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopProgress() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (intervalRef.current) return;
    setVisible(true);
    setWidth(20);
    intervalRef.current = setInterval(() => {
      setWidth((w) => Math.min(92, w + Math.random() * 12));
    }, 180);
  };

  const finish = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setWidth(100);
    setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 300);
  };

  useEffect(() => {
    // Start on most link clicks (client-side navigation)
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const anchor = target?.closest ? (target.closest("a") as HTMLAnchorElement | null) : null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      if (!href) return;
      if (href.startsWith("#")) return;
      if (targetAttr === "_blank") return;
      // assume client navigation
      start();
    };

    const onPop = () => start();

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useEffect(() => {
    // pathname changed -> navigation finished
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      finish();
    }
  }, [pathname]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return (
    <div className={`top-progress ${visible ? "top-progress--visible" : ""}`} aria-hidden>
      <div className="top-progress__bar" style={{ width: `${width}%` }} />
    </div>
  );
}
