import React from "react";
import { useToast } from '../components/Toast';

export type CartItem = {
  id: string;
  name: string;
  subtitle?: string;
  color?: string;
  size?: string;
  price: number;
  qty: number;
  image: string;
  inStock: boolean;
};

const currency = (n: number) => `GH₵${n.toFixed(2)}`;

const FREE_SHIP_THRESHOLD = 100;

interface CartPageProps {
  initialItems?: CartItem[];
  onNavigate?: (page: 'home' | 'cart' | 'account') => void;
}

export default function CartPage({ initialItems, onNavigate }: CartPageProps) {
  const { showToast } = useToast();
  const [items, setItems] = React.useState<CartItem[]>(
    initialItems ?? [
      {
        id: "dress-1",
        name: "Wrap Midi Dress",
        subtitle: "Soft crepe • Elegant drape",
        color: "Rosewood",
        size: "M",
        price: 69,
        qty: 1,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
        inStock: true,
      },
      {
        id: "heel-1",
        name: "Strappy Heels",
        subtitle: "Padded footbed • 7cm",
        color: "Ivory",
        size: "38",
        price: 59,
        qty: 2,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
        inStock: true,
      },
      {
        id: "bag-1",
        name: "Mini Crossbody Bag",
        subtitle: "Vegan leather • Magnetic flap",
        color: "Black",
        price: 44,
        qty: 1,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
        inStock: false,
      },
    ]
  );

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0 ? 0 : 6.95;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const updateQty = (id: string, qty: number) => {
    const validQty = Math.max(1, Math.min(10, qty));
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: validQty } : it)));
  };
  
  const handleQtyInputChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 1;
    updateQty(id, numValue);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  const moveToWishlist = (id: string) => {
    const item = items.find(it => it.id === id);
    if (item) {
      showToast('"' + item.name + '" moved to wishlist!', 'success');
      removeItem(id);
    }
  };
  
  const handleCheckout = () => {
    if (items.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }
    showToast('Proceeding to checkout with ' + items.length + ' item(s) totaling ' + currency(total), 'success');
  };
  
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const code = formData.get('promoCode') as string;
    if (code.trim()) {
      showToast('Promo code "' + code + '" applied!', 'success');
      form.reset();
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-28">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Your Bag</h1>
          <p className="mt-1 text-sm text-gray-600">{items.length} {items.length === 1 ? "item" : "items"}</p>
        </div>
        <button onClick={() => onNavigate?.('home')} className="text-sm font-medium text-rose-600 hover:text-rose-700">Continue shopping</button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1.7fr_1fr]">
        <section className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border bg-white p-10 text-center">
              <p className="text-gray-700">Your bag is empty</p>
              <button onClick={() => onNavigate?.('home')} className="mt-4 inline-flex rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700">Start shopping</button>
            </div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex gap-4 rounded-2xl border bg-white p-4">
                <img src={it.image} alt={it.name} className="h-28 w-24 shrink-0 rounded-xl object-cover md:h-32 md:w-28" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-medium text-gray-900">{it.name}</h3>
                      {it.subtitle && <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{it.subtitle}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        {it.color && <span>Color: {it.color}</span>}
                        {it.size && <span>Size: {it.size}</span>}
                        <span className={it.inStock ? "text-emerald-600" : "text-amber-600"}>
                          {it.inStock ? "In stock" : "Backorder"}
                        </span>
                      </div>
                    </div>
                    <p className="text-base font-semibold">{currency(it.price * it.qty)}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border">
                      <button
                        aria-label="Decrease quantity"
                        className="h-9 w-9 rounded-l-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => updateQty(it.id, it.qty - 1)}
                        disabled={it.qty <= 1}
                      >
                        −
                      </button>
                      <input
                        aria-label="Quantity"
                        className="h-9 w-12 border-x text-center outline-none focus:ring-2 focus:ring-rose-500"
                        value={it.qty}
                        onChange={(e) => handleQtyInputChange(it.id, e.target.value)}
                        inputMode="numeric"
                        min="1"
                        max="10"
                      />
                      <button
                        aria-label="Increase quantity"
                        className="h-9 w-9 rounded-r-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => updateQty(it.id, it.qty + 1)}
                        disabled={it.qty >= 10}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => moveToWishlist(it.id)} 
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Move to wishlist
                    </button>
                    <button 
                      onClick={() => removeItem(it.id)} 
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        <aside className="self-start rounded-2xl border bg-white p-5 md:sticky md:top-24">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{currency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{shipping === 0 ? "Free" : currency(shipping)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tax (est.)</span>
              <span className="font-medium">{currency(tax)}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{currency(total)}</span>
            </div>
          </div>

          <form className="mt-5" onSubmit={handleApplyPromo}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Promo code
            </label>
            <div className="flex gap-2">
              <input
                name="promoCode"
                placeholder="Enter code"
                className="h-11 flex-1 rounded-xl border px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button type="submit" className="h-11 rounded-xl border px-4 text-sm font-semibold hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-rose-500">Apply</button>
            </div>
          </form>

          <button 
            onClick={handleCheckout}
            className="mt-5 w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">Secure checkout • Free returns within 30 days</p>
        </aside>
      </div>

      <section className="mt-14">
        <h3 className="text-lg font-semibold">You may also like</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { id: 1, name: "Midi Skirt", price: 54, image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?q=80&w=1200&auto=format&fit=crop" },
            { id: 2, name: "Pearl Earrings", price: 25, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop" },
            { id: 3, name: "Sneakers", price: 75, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop" },
            { id: 4, name: "Cardigan", price: 75, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop" }
          ].map((item) => (
            <button key={item.id} onClick={() => onNavigate?.('home')} className="group overflow-hidden rounded-2xl border bg-white text-left">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">GH₵{item.price}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}