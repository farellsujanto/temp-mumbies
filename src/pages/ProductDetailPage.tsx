import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  additional_images: string[];
  tags: string[];
  category: string | null;
  inventory_status: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    mission: string | null;
  } | null;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(id, name, slug, description, mission)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading product:', error);
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          product_id: product.id,
          name: product.name,
          brand_name: product.brand?.name || 'Unknown',
          price: product.price,
          image_url: product.image_url,
        },
        quantity
      );
      window.location.href = '/cart';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => window.location.href = '/shop'}>
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
      >
        <ChevronLeft className="h-5 w-5" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>

        <div>
          {product.brand && (
            <a
              href={`/brands/${product.brand.slug}`}
              className="text-green-600 hover:text-green-700 font-medium mb-2 inline-block"
            >
              {product.brand.name}
            </a>
          )}

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <Badge key={tag} type={tag} />
              ))}
            </div>
          )}

          <div className="text-4xl font-bold text-green-600 mb-6">
            ${product.price.toFixed(2)}
          </div>

          {product.inventory_status === 'low_stock' && (
            <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-lg mb-6">
              Only a few left in stock!
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <Button size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {product.description && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.brand && (product.brand.description || product.brand.mission) && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-bold mb-3">About {product.brand.name}</h2>
              {product.brand.description && (
                <p className="text-gray-700 mb-3">{product.brand.description}</p>
              )}
              {product.brand.mission && (
                <p className="text-gray-600 italic">{product.brand.mission}</p>
              )}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.href = `/brands/${product.brand!.slug}`}
              >
                View Brand Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
