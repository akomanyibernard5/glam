import React, { useState, useEffect } from "react";
import {
  Mail,
  Shield,
  Truck,
  ArrowRight,
  Tag,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import ProductCard, { Product } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSpinner';
import LazyImage from '../components/LazyImage';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const allProducts: (Product & { category: string })[] = [
  
  { id: "d1", name: "Midi Dress", price: 79, image: "https:
  { id: "d2", name: "Maxi Dress", price: 89, image: "https:
  { id: "d3", name: "Bodycon Dress", price: 59, image: "https:
  { id: "d4", name: "Wrap Dress", price: 75, image: "https:
  
  
  { id: "t1", name: "Silk Blouse", price: 65, image: "https:
  { id: "t2", name: "Crop Top", price: 35, image: "https:
  { id: "t3", name: "Cardigan", price: 75, image: "https:
  
  
  { id: "bt1", name: "High-Waist Jeans", price: 69, image: "https:
  { id: "bt2", name: "Midi Skirt", price: 54, image: "https:
  
  
  { id: "b1", name: "Ladies Dressing Bag", price: 110, image: "https:
  { id: "b2", name: "Ladies Chain Handbag", price: 44, image: "https:
  { id: "b3", name: "Ladies Designer Tote", price: 89, image: "https:
  { id: "b4", name: "Ladies Evening Clutch", price: 65, image: "https:
  { id: "b5", name: "Ladies Shoulder Purse", price: 95, image: "https:
  
  
  { id: "j1", name: "Gold Necklace", price: 35, image: "https:
  { id: "j2", name: "Pearl Earrings", price: 25, image: "https:
  { id: "j3", name: "Silver Bracelet", price: 40, image: "https:
  { id: "j4", name: "Ring Set", price: 30, image: "https:
  { id: "j5", name: "Diamond Earrings", price: 120, image: "https:
  
  
  { id: "w1", name: "Ladies Curly Lace Front Wig", price: 150, image: "https:
  { id: "w2", name: "Ladies Sleek Bob Wig", price: 120, image: "https:
  { id: "w3", name: "Ladies Long Wavy Wig", price: 180, image: "https:
  { id: "w4", name: "Ladies Pixie Cut Wig", price: 95, image: "https:
  { id: "w5", name: "Ladies Braided Wig", price: 200, image: "https:
];

interface HomePageProps {
  onNavigate?: (page: 'home' | 'cart' | 'account' | 'wishlist') => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  searchQuery?: string;
}

export default function HomePage({ onNavigate, selectedCategory = '', onCategoryChange, searchQuery = '' }: HomePageProps) {
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory && searchQuery) {
      
    }
  }, [selectedCategory, searchQuery]);

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const handleCategoryChange = async (category: string) => {
    setIsLoadingProducts(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onCategoryChange?.(category);
    setIsLoadingProducts(false);
    
    
    const productsSection = document.querySelector('[data-products-section]');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts = searchQuery
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedCategory 
    ? allProducts.filter(p => p.category === selectedCategory)
    : allProducts.slice(0, 12);

  const bestSellers = allProducts.slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-28">
      {}
      <section className="relative overflow-hidden rounded-xl border bg-gradient-to-tr from-rose-50 via-white to-rose-100">
        <div className="grid gap-3 p-4 md:grid-cols-2 md:p-6">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-3 py-1 text-xs font-semibold text-rose-700">
              <Sparkles className="h-4 w-4" /> New Season • New Drops
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">
              Effortless elegance for the modern woman
            </h1>
            <p className="mt-3 max-w-xl text-sm text-gray-700">
              Discover curated women's fashion - from chic dresses to statement accessories that celebrate your unique style.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange('')}
                className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Shop New In <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => handleCategoryChange('clothing')}
                className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-black/5"
              >
                Explore Clothes
              </button>
            </div>
            <div className="mt-6 grid gap-3 text-xs text-gray-700 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Free shipping over GH₵100
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Free 30-day returns
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> 24/7 support
              </div>
            </div>
          </div>

          <div className="relative">
            <LazyImage
              src="https:
              alt="Elegant woman in fashion"
              className="h-full w-full rounded-2xl object-cover"
            />
            <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-rose-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-rose-300/40 blur-2xl" />
          </div>
        </div>
      </section>

      {}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Featured Categories</h2>
          <button onClick={() => handleCategoryChange('')} className="text-sm font-medium text-rose-600 hover:text-rose-700">
            Shop all
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              key: "clothing",
              title: "Clothes",
              img: "https:
            },
            {
              key: "bags",
              title: "Bags",
              img: "https:
            },
            {
              key: "jewelry",
              title: "Jewelry",
              img: "https:
            },
            {
              key: "wigs",
              title: "Ladies Wigs",
              img: "https:
            },
          ].map((c) => (
            <button key={c.key} onClick={() => handleCategoryChange(c.key)} className="group overflow-hidden rounded-2xl border bg-white text-left">
              <div className="aspect-[4/5] overflow-hidden">
                <LazyImage
                  src={c.img}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <p className="text-sm font-semibold">{c.title}</p>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {}
      <section className="mt-10" data-products-section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` : 'New Arrivals'}
          </h2>
          <button onClick={() => handleCategoryChange('')} className="text-sm font-medium text-rose-600 hover:text-rose-700">
            View all
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoadingProducts ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 12).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))
          ) : (
            <div className="col-span-full">
              <div className="rounded-2xl border bg-white p-12 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? `No results for "${searchQuery}"` : `No ${selectedCategory} products found`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? "Try searching for clothes, bags, jewelry, or wigs" 
                    : "Check back later for new arrivals in this category"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      onCategoryChange?.('');
                      if (searchQuery) {
                        
                        window.location.reload();
                      }
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    {searchQuery ? 'Clear Search' : 'Browse All Products'}
                  </button>
                  <button
                    onClick={() => handleCategoryChange('clothing')}
                    className="inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-gray-50"
                  >
                    Shop Clothes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {}
      <section className="mt-12 overflow-hidden rounded-2xl border bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide">
              <Tag className="h-3.5 w-3.5" /> Limited time
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Women's Fashion Sale</h3>
            <p className="text-sm text-white/80">Up to 40% off selected women's styles</p>
          </div>
          <button
            onClick={() => handleCategoryChange('sale')}
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-white/90"
          >
            Shop the Sale <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>

      {}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Best Sellers</h2>
        </div>
        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex gap-4">
            {bestSellers.map((p) => (
              <div key={p.id} className="w-64 shrink-0">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <button onClick={() => handleCategoryChange('lookbook')} className="group overflow-hidden rounded-2xl border bg-white text-left">
          <div className="aspect-[16/10] overflow-hidden">
            <LazyImage
              src="https:
              alt="Women's fashion lookbook"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Lookbook</p>
            <h3 className="mt-1 text-lg font-semibold">Women's Fall Essentials</h3>
            <p className="mt-1 text-sm text-gray-600">
              Curated pieces for the modern woman's autumn wardrobe.
            </p>
          </div>
        </button>

        <button onClick={() => handleCategoryChange('editorial')} className="group overflow-hidden rounded-2xl border bg-white text-left">
          <div className="aspect-[16/10] overflow-hidden">
            <LazyImage
              src="https:
              alt="Women's style guide"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Guide</p>
            <h3 className="mt-1 text-lg font-semibold">How to Style Satin</h3>
            <p className="mt-1 text-sm text-gray-600">
              From day to night with three easy outfit formulas.
            </p>
          </div>
        </button>
      </section>
    </main>
  );
}