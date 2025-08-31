import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Search,
  User,

  ChevronDown,
  ChevronRight,
} from "lucide-react";




const NAV_LINKS = [
  { label: "New In", href: "#new" },
  {
    label: "Clothes",
    href: "#clothes",
    mega: {
      columns: [
        {
          title: "Dresses",
          items: ["Midi Dress", "Maxi Dress", "Bodycon Dress", "Wrap Dress", "Evening Dress"],
        },
        {
          title: "Tops",
          items: ["Blouse", "T-Shirt", "Crop Top", "Bodysuit", "Cardigan"],
        },
        {
          title: "Jeans & Trousers",
          items: ["High-Waist Jeans", "Skinny Jeans", "Wide Leg Trousers", "Palazzo Pants", "Leggings"],
        },
      ],
      banner: {
        title: "Fall Essentials",
        subtitle: "Layer-ready looks you’ll love",
        cta: "Shop Collection",
      },
    },
  },
  { label: "Bags", href: "#bags" },
  { label: "Jewelry", href: "#jewelry" },
  { label: "Wigs", href: "#wigs" },
  { label: "Sale", href: "#sale", highlight: true },
];

type Page = 'home' | 'cart' | 'account' | 'wishlist' | 'auth' | 'login';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
  cartCount?: number;
  wishlistCount?: number;
  onCategoryChange?: (category: string) => void;
  onSearch?: (query: string) => void;
}

export default function Navbar({ onNavigate, currentPage, cartCount = 0, wishlistCount = 0, onCategoryChange, onSearch }: NavbarProps) {
  const [atTop, setAtTop] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = (key: string) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setActiveMega(key);
  };
  const closeMega = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActiveMega(null), 100);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={[
          "pointer-events-auto w-full max-w-7xl",
          "rounded-full border backdrop-blur supports-[backdrop-filter]:bg-white/70",
          atTop ? "border-white/40 shadow-sm" : "border-black/10 bg-white/90 shadow-xl",
        ].join(" ")}
        aria-label="Primary"
      >
        {}
        <div className="flex items-center gap-2 px-4 py-2 md:px-6">


          {}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <div className="rounded-full bg-black p-2 text-white"><ShoppingBag className="h-4 w-4"/></div>
            <span className={`font-semibold tracking-tight md:text-lg transition-opacity ${searchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>Ladies Glam</span>
          </button>

          {}
          <div className="ml-2 hidden items-center md:flex">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.mega && openMega(link.label)}
                  onMouseLeave={() => link.mega && closeMega()}
                >
                  <button
                    onClick={() => {
                      const category = link.label.toLowerCase().replace(/\s+/g, '');
                      onCategoryChange?.(category === 'newin' ? '' : category === 'clothes' ? 'clothing' : category);
                      onNavigate('home');
                      setTimeout(() => {
                        const section = document.querySelector('[data-products-section]');
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                      }, 200);
                    }}
                    className={[
                      "flex select-none items-center gap-1 rounded-full px-3 py-2 text-sm font-medium",
                      "hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                      link.highlight ? "text-rose-600" : "text-gray-800",
                    ].join(" ")}
                    aria-haspopup={!!link.mega}
                    aria-expanded={activeMega === link.label}
                  >
                    {link.label}
                    {link.mega && <ChevronDown className="h-4 w-4" />}
                  </button>

                  {}
                  {link.mega && (
                    <AnimatePresence>
                      {activeMega === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-0 top-11 w-[720px] overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-2xl"
                          role="dialog"
                          aria-label={`${link.label} menu`}
                          onMouseEnter={() => openMega(link.label)}
                          onMouseLeave={closeMega}
                        >
                          <div className="grid grid-cols-4 gap-6">
                            {link.mega.columns.map((col, idx) => (
                              <div key={idx}>
                                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  {col.title}
                                </h4>
                                <ul className="space-y-2">
                                  {col.items.map((item) => (
                                    <li key={item}>
                                      <button
                                        onClick={() => {
                                          onCategoryChange?.(col.title.toLowerCase() === 'dresses' || col.title.toLowerCase() === 'tops' || col.title.toLowerCase() === 'jeans & trousers' ? 'clothing' : col.title.toLowerCase());
                                          onNavigate('home');
                                          setActiveMega(null);
                                        }}
                                        className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-black/5"
                                      >
                                        {item}
                                        <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            {}
                            <div className="col-span-4 mt-2 rounded-xl bg-rose-50/70 p-4">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                  <p className="text-sm font-medium text-rose-700">{link.mega.banner.title}</p>
                                  <p className="text-sm text-rose-900/70">{link.mega.banner.subtitle}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    onCategoryChange?.('clothing');
                                    onNavigate('home');
                                    setActiveMega(null);
                                  }}
                                  className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                                >
                                  {link.mega.banner.cta}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="flex-1" />

          {}
          <div className="flex items-center gap-1">
            {}
            <div className="relative flex items-center">
              <motion.input
                initial={{ width: 40 }}
                animate={{ width: searchOpen ? 'min(240px, calc(100vw - 200px))' : 40 }}
                transition={{ type: "tween", duration: 0.2 }}
                onFocus={() => setSearchOpen(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setTimeout(() => setSearchOpen(false), 100);
                  }
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSearch?.(searchQuery);
                    onNavigate('home');
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search…"
                className="peer h-10 rounded-full border border-black/10 bg-white pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none max-w-full"
              />
              <Search className="pointer-events-none absolute left-2 h-5 w-5 text-gray-500" />
            </div>

            {}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('account')}
              className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 md:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="relative hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto fixed bottom-4 left-4 right-4 z-50 md:hidden"
      >
        <div className="mx-auto max-w-sm rounded-2xl border border-black/10 bg-white/90 backdrop-blur shadow-xl">
          <div className="grid grid-cols-3 gap-1 p-2">
            <button
              onClick={() => onNavigate('wishlist')}
              className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-3 transition-colors ${
                currentPage === 'wishlist' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">Wishlist</span>
            </button>
            <button
              onClick={() => onNavigate('account')}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-3 transition-colors ${
                currentPage === 'account' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Account</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-3 transition-colors ${
                currentPage === 'cart' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">Cart</span>
            </button>
          </div>
        </div>
      </motion.nav>






    </div>
  );
}
