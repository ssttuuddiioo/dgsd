"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="px-6 py-8 border-t border-border"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-foreground/60">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="mailto:hello@dgsd.com"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              hello@dgsd.com
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

