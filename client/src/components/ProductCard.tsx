import React, { useState, useEffect } from 'react';
import { Star, Heart, MessageCircle, X } from 'lucide-react';
import { useToast } from './Toast';
import LazyImage from './LazyImage';
import LoadingButton from './LoadingButton';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  badge?: string;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

interface ProductCardProps {
  p: Product;
}

const currency = (n: number) =>
  `GH₵${n.toFixed(2)}`;

export default function ProductCard({ p }: ProductCardProps) {
  const { showToast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', name: 'Anonymous', rating: 5, comment: 'Love this product! Great quality and fast delivery.', date: '2024-01-15' },
    { id: '2', name: 'Anonymous', rating: 4, comment: 'Very nice, exactly as described. Highly recommend!', date: '2024-01-10' }
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Freeze scroll when modal is open
  useEffect(() => {
    if (showReviews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReviews]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    showToast(`${p.name} added to cart!`, 'success');
    setIsAddingToCart(false);
  };

  const handleAddToWishlist = () => {
    showToast(`${p.name} added to wishlist!`, 'success');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      showToast('Please write a comment', 'error');
      return;
    }
    const review: Review = {
      id: Date.now().toString(),
      name: 'Anonymous',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 5, comment: '' });
    showToast('Review submitted successfully!', 'success');
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-white animate-fade-in-up">
      {/* Badge */}
      {p.badge && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black px-2 py-1 text-xs font-semibold text-white">
          {p.badge}
        </div>
      )}
      
      {/* Wishlist button */}
      <button
        onClick={handleAddToWishlist}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
        aria-label="Add to wishlist"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden">
        <LazyImage
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-900">{p.name}</h3>
        
        {/* Rating & Reviews */}
        <div className="mt-1 flex items-center justify-between">
          {p.rating && (
            <button
              onClick={() => setShowReviews(true)}
              className="flex items-center gap-1 hover:opacity-75"
            >
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{p.rating}</span>
            </button>
          )}
          <button
            onClick={() => setShowReviews(true)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <MessageCircle className="h-3 w-3" />
            <span>({reviews.length})</span>
          </button>
        </div>
        
        {/* Price */}
        <p className="mt-1 sm:mt-2 text-sm sm:text-lg font-semibold text-gray-900">{currency(p.price)}</p>
        
        {/* Add to cart button */}
        <LoadingButton
          onClick={handleAddToCart}
          isLoading={isAddingToCart}
          variant="secondary"
          className="mt-2 sm:mt-3 w-full bg-black hover:bg-gray-800 text-xs sm:text-sm py-1.5 sm:py-2"
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </LoadingButton>
      </div>

      {/* Reviews Modal */}
      {showReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reviews for {p.name}</h3>
              <button 
                onClick={() => setShowReviews(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="mb-6 rounded-xl border p-4">
              <h4 className="font-medium mb-3">Write a Review</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className={`p-1 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    rows={3}
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                >
                  Submit Review
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div>
              <h4 className="font-medium mb-4">Customer Reviews ({reviews.length})</h4>
              <div className="max-h-64 overflow-y-auto space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.name}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}