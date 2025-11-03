import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';

interface Product {
  id: string;
  shopify_id: string;
  title: string;
  description: string;
  vendor: string;
  price: number;
  featured_image: string;
  images: any[];
  variants: any[];
  has_variants: boolean;
}

interface SelectedProduct {
  product: Product;
  variant_id?: string;
  variant_title?: string;
  quantity: number;
}

interface Props {
  products: Product[];
  selectedProducts: SelectedProduct[];
  onAddProduct: (product: SelectedProduct) => void;
  onClose: () => void;
}

export default function ProductSelectionModal({
  products,
  selectedProducts,
  onAddProduct,
  onClose
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const isProductSelected = (productId: string, variantId?: string) => {
    return selectedProducts.some(
      sp => sp.product.id === productId && sp.variant_id === variantId
    );
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    if (product.has_variants && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    onAddProduct({
      product: selectedProduct,
      variant_id: selectedVariant?.id?.toString(),
      variant_title: selectedVariant?.title || 'Default',
      quantity
    });

    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Select Products</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Product List */}
          <div className="w-1/2 border-r overflow-y-auto p-6">
            <div className="space-y-3">
              {products.map((product) => {
                const alreadySelected = isProductSelected(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50'
                        : alreadySelected
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      {product.featured_image && (
                        <img
                          src={product.featured_image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {product.title}
                          </h3>
                          {alreadySelected && (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{product.vendor}</p>
                        <p className="text-sm font-bold text-green-600 mt-1">
                          ${product.price?.toFixed(2)}
                        </p>
                        {product.has_variants && (
                          <p className="text-xs text-blue-600 mt-1">
                            {product.variants?.length || 0} variants available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-1/2 overflow-y-auto p-6">
            {selectedProduct ? (
              <div className="space-y-4">
                {selectedProduct.featured_image && (
                  <img
                    src={selectedProduct.featured_image}
                    alt={selectedProduct.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedProduct.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProduct.vendor}
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ${selectedProduct.price?.toFixed(2)}
                  </p>
                </div>

                {selectedProduct.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div
                      className="text-sm text-gray-600 mt-1"
                      dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                    />
                  </div>
                )}

                {selectedProduct.has_variants && selectedProduct.variants?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Variant
                    </label>
                    <div className="space-y-2">
                      {selectedProduct.variants.map((variant: any) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`w-full px-4 py-3 border rounded-lg text-left transition-colors ${
                            selectedVariant?.id === variant.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {variant.title}
                              </p>
                              {variant.sku && (
                                <p className="text-xs text-gray-500 mt-1">
                                  SKU: {variant.sku}
                                </p>
                              )}
                            </div>
                            <p className="font-bold text-green-600">
                              ${parseFloat(variant.price).toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleAddProduct}
                  disabled={isProductSelected(selectedProduct.id, selectedVariant?.id?.toString())}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  {isProductSelected(selectedProduct.id, selectedVariant?.id?.toString())
                    ? 'Already Added'
                    : 'Add to Bundle'
                  }
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Select a product to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
