"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { NAV_CATEGORIES } from "@/lib/nav-data";
import PageHeader from "@/components/ui/page-header";

function normalize(path: string) {
  if (!path) return "/";
  // remove trailing slash except root
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export default function PageHeaderFromPath() {
  const pathname = normalize(usePathname() || "/");

  let title: string | null = null;
  for (const cat of NAV_CATEGORIES) {
    for (const item of cat.items) {
      if (normalize(item.href) === pathname) {
        title = item.label;
        break;
      }
    }
    if (title) break;
  }

  if (!title) return null;

  return (
    <div className="pt-4">
      <PageHeader title={title} />
    </div>
  );
}