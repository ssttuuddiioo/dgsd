"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white hover:opacity-70 transition-opacity"
        >
          {SITE_CONFIG.name}
        </Link>

        <ul className="flex items-center gap-6">
          <li>
            <Link
              href="/about"
              className="text-sm font-medium text-white hover:opacity-70 transition-opacity"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/archive"
              className="text-sm font-medium text-white hover:opacity-70 transition-opacity"
            >
              Archive
            </Link>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}

