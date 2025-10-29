import { ShoppingCart } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    base_price?: number | null;
    has_variants?: boolean;
    image_url: string | null;
    brand_name?: string;
    tags: string[];
    inventory_status?: string;
    promotional_deal?: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      product_id: product.id,
      name: product.name,
      brand_name: product.brand_name || 'Unknown Brand',
      price: product.price,
      image_url: product.image_url,
    });
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <a href={`/product/${product.id}`} className="block">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {product.inventory_status === 'low_stock' && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </div>
          )}
        </div>
      </a>

      <div className="p-4">
        {product.brand_name && (
          <p className="text-sm text-gray-600 mb-1">{product.brand_name}</p>
        )}
        <a href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 line-clamp-2">
            {product.name}
          </h3>
        </a>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} type={tag} size="sm" />
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              {product.has_variants && product.base_price ? (
                <>From ${product.base_price.toFixed(2)}</>
              ) : (
                <>${product.price.toFixed(2)}</>
              )}
            </span>
            {product.has_variants ? (
              <Button size="sm" onClick={() => window.location.href = `/product/${product.id}`}>
                Select
              </Button>
            ) : (
              <Button size="sm" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
          {product.promotional_deal && (
            <div className="bg-orange-50 border border-orange-200 rounded px-2 py-1">
              <p className="text-xs font-semibold text-orange-700 text-center">
                {product.promotional_deal}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
