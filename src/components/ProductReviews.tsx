import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  reviewer_name: string;
  reviewer_location: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  image_urls: string[];
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    if (profile) {
      setReviewerName(profile.full_name || '');
    }
  }, [profile]);

  const loadReviews = async () => {
    const { data } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (data) {
      setReviews(data);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('product_reviews')
      .insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title,
        content,
        reviewer_name: reviewerName,
        verified_purchase: false,
        is_approved: true,
      });

    if (error) {
      alert('Error submitting review. Please try again.');
      console.error(error);
    } else {
      setTitle('');
      setContent('');
      setRating(0);
      setShowReviewForm(false);
      loadReviews();
    }

    setSubmitting(false);
  };

  const StarRating = ({ rating: currentRating, interactive = false, size = 'md' }: { rating: number; interactive?: boolean; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-8 w-8',
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= (interactive ? (hoverRating || rating) : currentRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const distribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <div className="bg-white rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      <div className="grid md:grid-cols-3 gap-8 mb-8 pb-8 border-b">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{averageRating}</div>
          <StarRating rating={parseFloat(averageRating)} />
          <div className="text-gray-600 mt-2">Based on {reviews.length} reviews</div>
        </div>

        <div className="md:col-span-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star as keyof typeof distribution];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{star}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {!showReviewForm ? (
        <div className="mb-8">
          <Button
            onClick={() => setShowReviewForm(true)}
            className="w-full md:w-auto"
          >
            Write a Review
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Write Your Review</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <StarRating rating={rating} interactive size="lg" />
          </div>

          <div className="mb-4">
            <label htmlFor="reviewer-name" className="block text-sm font-medium mb-2">
              Name *
            </label>
            <input
              id="reviewer-name"
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="review-title" className="block text-sm font-medium mb-2">
              Review Title *
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="review-content" className="block text-sm font-medium mb-2">
              Review *
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this product"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            ></textarea>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowReviewForm(false);
                setRating(0);
                setTitle('');
                setContent('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <StarRating rating={review.rating} size="sm" />
                <h4 className="font-bold text-lg mt-2">{review.title}</h4>
              </div>
              {review.verified_purchase && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Verified Purchase
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600 mb-3">
              <span className="font-medium">{review.reviewer_name}</span>
              {review.reviewer_location && (
                <>
                  {' • '}
                  <span>{review.reviewer_location}</span>
                </>
              )}
              {' • '}
              <span>{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>

            {review.image_urls && review.image_urls.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {review.image_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Review image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(url, '_blank')}
                  />
                ))}
              </div>
            )}

            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <ThumbsUp className="h-4 w-4" />
              <span>Helpful ({review.helpful_count})</span>
            </button>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No reviews yet</p>
            <p>Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
}
