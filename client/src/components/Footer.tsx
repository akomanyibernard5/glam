import React from "react";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,

  ShoppingBag
} from "lucide-react";
import { useToast } from './Toast';

export function Footer() {
  const { showToast } = useToast();
  const year = new Date().getFullYear();

  const handleAppStoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('App Store download is under development', 'info');
  };

  const handleGooglePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Google Play download is under development', 'info');
  };

  const columns: { title: string; links: { label: string; href: string }[]; isContact?: boolean }[] = [
    {
      title: "Shop",
      links: [
        { label: "New In", href: "#new" },
        { label: "Dresses", href: "#dresses" },
        { label: "Shoes", href: "#shoes" },
        { label: "Bags", href: "#bags" },
        { label: "Jewelry", href: "#jewelry" },
        { label: "Sale", href: "#sale" },
      ],
    },

    {
      title: "Contact",
      links: [],
      isContact: true,
    },
  ];

  return (
    <footer className="mt-28 border-t bg-white">
      <section className="relative">
        <div className="mx-auto -mt-16 w-full max-w-7xl px-4">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-tr from-rose-50 via-white to-rose-100 p-8 shadow-xl md:p-12">
            <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
              <div>
                <p className="inline-block rounded-full border border-rose-200 bg-white/60 px-3 py-1 text-xs font-semibold tracking-wide text-rose-700">
                  10% off your first order
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
                  Join the Ladies Glam Circle
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Be the first to know about drops, limited editions, and private sales
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const email = formData.get('email') as string;
                  if (email && email.includes('@')) {
                    showToast('Successfully subscribed to Ladies Glam Circle! Check your email for 10% off coupon.', 'success');
                    form.reset();
                  } else {
                    showToast('Please enter a valid email address', 'error');
                  }
                }}
                className="flex w-full items-center gap-2"
                aria-label="Newsletter subscription"
              >
                <div className="relative w-full">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-full border border-black/10 bg-white pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  Subscribe <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <a href="/" className="flex items-center gap-2">
              <div className="rounded-full bg-black p-2 text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Ladies Glam</span>
            </a>
            <p className="mt-3 max-w-sm text-sm text-gray-600">
              Elevated essentials and statement pieces designed for modern women — thoughtfully crafted for comfort and confidence
            </p>

            <div className="mt-5 flex items-center gap-2">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href={`https:
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 hover:bg-black/5"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /> support@ladiesglam.shop</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> +233 25 717 9772</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" /> Racecourse Takoradi, Ghana</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {col.title}
                </h4>
                {col.isContact ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const phone = formData.get('phone') as string;
                    const email = formData.get('contactEmail') as string;
                    const message = formData.get('message') as string;
                    
                    if (phone && email && message) {
                      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
                      form.reset();
                    } else {
                      showToast('Please fill in all fields', 'error');
                    }
                  }} className="mt-4 space-y-3">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your phone"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <input
                      type="email"
                      name="contactEmail"
                      placeholder="Your email"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <textarea
                      name="message"
                      placeholder="Your message"
                      rows={3}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="text-sm text-gray-700 hover:text-gray-900"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Get the app</h4>
              <div className="mt-4 space-y-3">
                <a href="/app-store" onClick={handleAppStoreClick} className="block w-full">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-black px-4 py-3 text-white transition-colors hover:bg-gray-800">
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-90">Download on the</div>
                      <div className="text-lg font-semibold leading-tight">App Store</div>
                    </div>
                  </div>
                </a>
                <a href="/google-play" onClick={handleGooglePlayClick} className="block w-full">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-black px-4 py-3 text-white transition-colors hover:bg-gray-800">
                    <svg className="h-7 w-7" viewBox="0 0 24 24">
                      <path fill="#FFD54F" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5Z"/>
                      <path fill="#FF7043" d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12Z"/>
                      <path fill="#4CAF50" d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81Z"/>
                      <path fill="#2196F3" d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-90">GET IT ON</div>
                      <div className="text-lg font-semibold leading-tight">Google Play</div>
                    </div>
                  </div>
                </a>
              </div>


            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-white/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-4 text-sm text-gray-600 md:flex-row md:items-center md:justify-between md:gap-3">
            <p className="text-center md:text-left">© {year} Ladies Glam. All rights reserved.</p>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-end">
              <div className="flex items-center justify-center gap-4 sm:gap-5">
                <a href="/privacy" className="hover:text-gray-900">Privacy</a>
                <a href="/terms" className="hover:text-gray-900">Terms</a>
                <a href="/accessibility" className="hover:text-gray-900">Accessibility</a>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs sm:text-sm">We accept</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-7 sm:h-5 sm:w-8 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">VISA</div>
                  <div className="h-4 w-7 sm:h-5 sm:w-8 rounded bg-red-500 flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full -ml-1"></div>
                  </div>
                  <div className="h-4 w-7 sm:h-5 sm:w-8 rounded bg-yellow-500 flex items-center justify-center text-black text-[10px] sm:text-xs font-bold">MTN</div>
                  <div className="h-4 w-7 sm:h-5 sm:w-8 rounded bg-red-600 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">VODA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;