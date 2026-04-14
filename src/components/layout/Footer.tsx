import Link from "next/link";
import { Truck, Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  trailers: [
    { href: "/browse?type=enclosed", label: "Enclosed Trailers" },
    { href: "/browse?type=utility", label: "Utility Trailers" },
    { href: "/browse?type=flatbed", label: "Flatbed Trailers" },
    { href: "/browse?type=dump", label: "Dump Trailers" },
    { href: "/browse?type=car-hauler", label: "Car Haulers" },
    { href: "/browse?type=travel", label: "Travel Trailers" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/about#faq", label: "FAQ" },
    { href: "/about#contact", label: "Contact" },
    { href: "/my-rentals", label: "My Rentals" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Truck className="h-7 w-7 text-orange-500" />
              <span className="text-lg font-bold text-white tracking-tight">
                TrailerRent
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Quality trailer rentals for every job. Serving the greater
              Portland area since 2019.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>(503) 555-0172</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>hello@trailerrent.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>8240 SE Powell Blvd, Portland, OR</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Trailers
            </h3>
            <ul className="space-y-2">
              {footerLinks.trailers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Hours
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Mon – Fri: 7am – 6pm</p>
              <p>Saturday: 8am – 4pm</p>
              <p>Sunday: 9am – 2pm</p>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-10 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TrailerRent. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
