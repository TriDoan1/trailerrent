"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/browse", label: "Browse Trailers" },
  { href: "/about", label: "About" },
  { href: "/my-rentals", label: "My Rentals" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-navy-900 sticky top-0 z-40">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-white tracking-tight">
              TrailerRent
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Button size="sm">Get a Quote</Button>
          </div>

          <button
            className="md:hidden p-2 text-gray-300 hover:text-white cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-navy-700 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 pt-2">
              <Button size="md" className="w-full">
                Get a Quote
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
