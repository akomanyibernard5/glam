import React, { useState } from 'react';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useToast } from '../components/Toast';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface WishlistProps {
  onNavigate?: (page: 'home' | 'cart' | 'account' | 'wishlist') => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'Wrap Midi Dress',
      price: 69,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
      inStock: true
    },
    {
      id: '2',
      name: 'Strappy Heels',
      price: 59,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      inStock: true
    },
    {
      id: '3',
      name: 'Silk Blouse',
      price: 79,
      image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop',
      inStock: true
    },
    {
      id: '4',
      name: 'Gold Necklace',
      price: 35,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      inStock: true
    },
    {
      id: '5',
      name: 'Crossbody Bag',
      price: 110,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      inStock: false
    },
    {
      id: '6',
      name: 'Blazer',
      price: 99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
      inStock: true
    }
  ]);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (item: WishlistItem) => {
    showToast(`Added "${item.name}" to cart!`, 'success');
    removeItem(item.id);
  };

  return (
    <main className="min-h-screen pt-20 sm:pt-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} saved for later</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
            <button
              onClick={() => onNavigate?.('home')}
              className="bg-rose-600 text-white px-6 py-3 rounded-full hover:bg-rose-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                  {!item.inStock && (
                    <div className="absolute top-3 left-3 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-lg font-bold text-gray-900 mb-4">GH₵{item.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;