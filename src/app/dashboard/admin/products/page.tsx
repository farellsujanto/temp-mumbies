'use client';

import { useState, useEffect, Fragment } from 'react';
import { Package, Plus, Edit2, Trash2, Search, RefreshCw, X, ChevronDown, ChevronRight } from 'lucide-react';
import AdminInput from '@/src/components/AdminInput';
import AdminButton from '@/src/components/AdminButton';
import AdminTextarea from '@/src/components/AdminTextarea';
import DeleteConfirmationModal from '@/src/components/DeleteConfirmationModal';
import ConfirmationModal from '@/src/components/ConfirmationModal';
import { Product, ProductVariant, Vendor, ProductType, Category, Tag } from '@/generated/prisma';

type ProductVariantWithChildren = ProductVariant & {
    childVariants?: ProductVariant[];
}

type ProductWithVariants = Product & {
    variants: ProductVariantWithChildren[];
    vendor: Vendor | null;
    productType: ProductType | null;
    category: Category;
    tag: Tag;
}

interface ChildVariantFormData {
    title: string;
    sku: string;
    price: string;
    discountedPrice: string;
    inventoryQuantity: string;
    referralPercentage: string;
}

interface ParentVariantFormData {
    title: string;
    isStandalone?: boolean; // Treat as standalone variant (child without parent)
    children: ChildVariantFormData[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductWithVariants[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductWithVariants | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; product: ProductWithVariants | null; deleting: boolean }>({ show: false, product: null, deleting: false });
    const [syncModal, setSyncModal] = useState<{ show: boolean; confirming: boolean }>({ show: false, confirming: false });
    const [syncResultModal, setSyncResultModal] = useState<{ show: boolean; success: boolean; message: string; data?: any }>({ show: false, success: false, message: '', data: null });
    const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        categoryId: '',
        tagId: '',
        price: '',
        sku: '',
        inventoryQuantity: '',
        referralPercentage: '',
        published: false,
    });
    const [variants, setVariants] = useState<ParentVariantFormData[]>([]);
    const [showVariants, setShowVariants] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchTags();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/v1/admin/products');
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/v1/admin/categories');
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/v1/admin/tags');
            const data = await res.json();
            if (data.success) setTags(data.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const body: any = {
                title: formData.title,
                slug: formData.slug,
                description: formData.description || null,
                categoryId: parseInt(formData.categoryId),
                tagId: parseInt(formData.tagId),
                price: formData.price ? parseFloat(formData.price) : null,
                sku: formData.sku || null,
                inventoryQuantity: formData.inventoryQuantity ? parseInt(formData.inventoryQuantity) : null,
                referralPercentage: formData.referralPercentage ? parseFloat(formData.referralPercentage) : 10.0,
                published: formData.published,
                variants: showVariants ? variants.map((parent, index) => {
                    // Check if this is a standalone variant
                    if (parent.isStandalone && parent.children.length > 0) {
                        const child = parent.children[0];
                        return {
                            title: child.title,
                            position: index + 1,
                            isStandalone: true,
                            sku: child.sku || null,
                            price: child.price ? parseFloat(child.price) : 0,
                            discountedPrice: child.discountedPrice ? parseFloat(child.discountedPrice) : null,
                            inventoryQuantity: child.inventoryQuantity ? parseInt(child.inventoryQuantity) : 0,
                            available: true,
                            referralPercentage: child.referralPercentage ? parseFloat(child.referralPercentage) : 0,
                            children: [],
                        };
                    }

                    // Regular parent variant with children
                    return {
                        title: parent.title,
                        position: index + 1,
                        isStandalone: false,
                        children: parent.children.map(child => ({
                            title: child.title,
                            sku: child.sku || null,
                            price: child.price ? parseFloat(child.price) : 0,
                            discountedPrice: child.discountedPrice ? parseFloat(child.discountedPrice) : null,
                            inventoryQuantity: child.inventoryQuantity ? parseInt(child.inventoryQuantity) : 0,
                            available: true,
                            referralPercentage: child.referralPercentage ? parseFloat(child.referralPercentage) : 0,
                        })),
                    };
                }) : [],
            };

            // Add ID if editing
            if (editingProduct) {
                body.id = editingProduct.id;
            }

            const res = await fetch('/api/v1/admin/products', {
                method: editingProduct ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                await fetchProducts();
                setShowModal(false);
                setEditingProduct(null);
                setFormData({
                    title: '',
                    slug: '',
                    description: '',
                    categoryId: '',
                    tagId: '',
                    price: '',
                    sku: '',
                    inventoryQuantity: '',
                    referralPercentage: '',
                    published: false,
                });
                setVariants([]);
                setShowVariants(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    const addVariant = (isStandalone = false) => {
        setVariants([...variants, {
            title: '',
            isStandalone: isStandalone,
            children: isStandalone ? [{
                title: '',
                sku: '',
                price: '',
                discountedPrice: '',
                inventoryQuantity: '',
                referralPercentage: '',
            }] : [],
        }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: keyof ParentVariantFormData, value: any) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };
        setVariants(updated);
    };

    const addChildVariant = (parentIndex: number) => {
        const updated = [...variants];
        updated[parentIndex].children.push({
            title: '',
            sku: '',
            price: '',
            discountedPrice: '',
            inventoryQuantity: '',
            referralPercentage: '',
        });
        setVariants(updated);
    };

    const removeChildVariant = (parentIndex: number, childIndex: number) => {
        const updated = [...variants];
        updated[parentIndex].children = updated[parentIndex].children.filter((_, i) => i !== childIndex);
        setVariants(updated);
    };

    const updateChildVariant = (parentIndex: number, childIndex: number, field: keyof ChildVariantFormData, value: string) => {
        const updated = [...variants];
        updated[parentIndex].children[childIndex] = {
            ...updated[parentIndex].children[childIndex],
            [field]: value
        };
        setVariants(updated);
    };

    const handleSyncShopify = async () => {
        setSyncModal({ show: false, confirming: true });
        setSyncing(true);
        try {
            const res = await fetch('/api/v1/admin/products/sync-shopify', {
                method: 'POST',
            });
            const data = await res.json();

            if (data.success) {
                setSyncResultModal({
                    show: true,
                    success: true,
                    message: data.message,
                    data: data.data
                });
                await fetchProducts();
            } else {
                setSyncResultModal({
                    show: true,
                    success: false,
                    message: data.message,
                    data: null
                });
            }
        } catch (error) {
            console.error('Sync error:', error);
            setSyncResultModal({
                show: true,
                success: false,
                message: 'Failed to sync with Shopify',
                data: null
            });
        } finally {
            setSyncing(false);
            setSyncModal({ show: false, confirming: false });
        }
    };

    const openEditModal = (product: ProductWithVariants) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            slug: product.slug,
            description: product.description || '',
            categoryId: product.categoryId?.toString() || '',
            tagId: product.tagId?.toString() || '',
            price: product.price?.toString() || '',
            sku: product.sku || '',
            inventoryQuantity: product.inventoryQuantity?.toString() || '',
            referralPercentage: product.referralPercentage?.toString() || '',
            published: product.published,
        });

        // Load existing variants if product has them
        if (product.variants && product.variants.length > 0) {
            setShowVariants(true);
            const loadedVariants = product.variants.map(parentVariant => {
                const isStandalone = !parentVariant.childVariants || parentVariant.childVariants.length === 0;

                return {
                    title: parentVariant.title,
                    isStandalone: isStandalone,
                    children: isStandalone ? [{
                        title: parentVariant.title,
                        sku: parentVariant.sku || '',
                        price: parentVariant.price?.toString() || '',
                        discountedPrice: parentVariant.discountedPrice?.toString() || '',
                        inventoryQuantity: parentVariant.inventoryQuantity?.toString() || '',
                        referralPercentage: parentVariant.referralPercentage?.toString() || '',
                    }] : (parentVariant.childVariants?.map(child => ({
                        title: child.title,
                        sku: child.sku || '',
                        price: child.price?.toString() || '',
                        discountedPrice: child.discountedPrice?.toString() || '',
                        inventoryQuantity: child.inventoryQuantity?.toString() || '',
                        referralPercentage: child.referralPercentage?.toString() || '',
                    })) || [])
                };
            });
            setVariants(loadedVariants as any);
        } else {
            setShowVariants(false);
            setVariants([]);
        }

        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.product) return;

        setDeleteModal(prev => ({ ...prev, deleting: true }));
        try {
            const res = await fetch(`/api/v1/admin/products?id=${deleteModal.product.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                await fetchProducts();
                setDeleteModal({ show: false, product: null, deleting: false });
            } else {
                alert(data.message);
                setDeleteModal(prev => ({ ...prev, deleting: false }));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete product');
            setDeleteModal(prev => ({ ...prev, deleting: false }));
        }
    };

    const toggleProductExpand = (productId: number) => {
        setExpandedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            const res = await fetch(`/api/v1/admin/products?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) await fetchProducts();
            else alert(data.message);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
                    <p className="text-gray-600">Manage your store products</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setSyncModal({ show: true, confirming: false })}
                        disabled={syncing}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync Shopify'}
                    </button>
                    <AdminButton onClick={() => {
                        setEditingProduct(null);
                        setFormData({
                            title: '',
                            slug: '',
                            description: '',
                            categoryId: '',
                            tagId: '',
                            price: '',
                            sku: '',
                            inventoryQuantity: '',
                            referralPercentage: '',
                            published: false,
                        });
                        setVariants([]);
                        setShowVariants(false);
                        setShowModal(true);
                    }} icon={Plus}>
                        Add Product
                    </AdminButton>
                </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none placeholder:text-gray-600"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Product</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Vendor</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Type</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Price</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Referral %</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <>
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                                <div>
                                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                                        <td className="px-6 py-4"><div className="flex justify-end gap-2">
                                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                                        </div></td>
                                    </tr>
                                ))}
                            </>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No products found</td></tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <Fragment key={product.id}>
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.variants.length > 0 && (
                                                    <button
                                                        onClick={() => toggleProductExpand(product.id)}
                                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                    >
                                                        {expandedProducts.has(product.id) ? (
                                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                                        )}
                                                    </button>
                                                )}
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.title}</div>
                                                    <div className="text-sm text-gray-500">{product.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.vendor?.name || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.productType?.name || '-'}</td>
                                        <td className="px-6 py-4">
                                            {product.variants.length > 0 ? (
                                                <span className="text-sm text-gray-600">{product.variants.length} variants</span>
                                            ) : product.price ? (
                                                <div>
                                                    {product.discountedPrice ? (
                                                        <div>
                                                            <span className="text-red-600 font-semibold">${product.discountedPrice.toString()}</span>
                                                            <span className="text-gray-400 line-through ml-2 text-sm">${product.price.toString()}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-semibold text-gray-900">${product.price.toString()}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.variants.length === 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                                                    {product.referralPercentage}%
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500">See variants</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${product.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {product.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, product, deleting: false })}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedProducts.has(product.id) && product.variants.length > 0 && (
                                        product.variants.map((parentVariant, pIndex) => {
                                            // Check if this is a standalone variant (no parent, no children)
                                            const isStandalone = !parentVariant.childVariants || parentVariant.childVariants.length === 0;

                                            if (isStandalone) {
                                                // Treat as a buyable variant with price/sku/inventory
                                                return (
                                                    <tr key={`standalone-${parentVariant.id}`} className="bg-green-50">
                                                        <td className="px-6 py-2 pl-20">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                                <span className="text-sm font-medium text-green-900">{parentVariant.title}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-2 text-xs text-green-700" colSpan={2}>
                                                            SKU: {parentVariant.sku || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-2">
                                                            {parentVariant.price ? (
                                                                <div className="text-sm">
                                                                    {parentVariant.discountedPrice ? (
                                                                        <>
                                                                            <span className="text-red-600 font-semibold">${parentVariant.discountedPrice.toString()}</span>
                                                                            <span className="text-gray-400 line-through ml-2 text-xs">${parentVariant.price.toString()}</span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="font-semibold text-gray-900">${parentVariant.price.toString()}</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-2">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                                                                {parentVariant.referralPercentage}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-2">
                                                            <span className="text-xs text-green-700">Stock: {parentVariant.inventoryQuantity}</span>
                                                        </td>
                                                        <td className="px-6 py-2"></td>
                                                    </tr>
                                                );
                                            }

                                            // This is a parent variant with children
                                            return (
                                                <Fragment key={`parent-${parentVariant.id}`}>
                                                    <tr key={`parent-${parentVariant.id}`} className="bg-blue-50">
                                                        <td className="px-6 py-3 pl-20">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => toggleProductExpand(parentVariant.id)}
                                                                    className="p-1 hover:bg-blue-200 rounded transition-colors"
                                                                >
                                                                    {expandedProducts.has(parentVariant.id) ? (
                                                                        <ChevronDown className="w-3 h-3 text-blue-600" />
                                                                    ) : (
                                                                        <ChevronRight className="w-3 h-3 text-blue-600" />
                                                                    )}
                                                                </button>
                                                                <span className="text-sm font-medium text-blue-900">{parentVariant.title}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 text-sm text-blue-700" colSpan={2}>Parent Variant</td>
                                                        <td className="px-6 py-3 text-sm text-blue-700">
                                                            {parentVariant.childVariants?.length || 0} options
                                                        </td>
                                                        <td className="px-6 py-3" colSpan={3}></td>
                                                    </tr>
                                                    {expandedProducts.has(parentVariant.id) && parentVariant.childVariants?.map((childVariant, cIndex) => (
                                                        <tr key={`child-${childVariant.id}`} className="bg-green-50">
                                                            <td className="px-6 py-2 pl-32">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                                    <span className="text-sm text-green-900">{childVariant.title}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-2 text-xs text-green-700" colSpan={2}>
                                                                SKU: {childVariant.sku || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-2">
                                                                {childVariant.price ? (
                                                                    <div className="text-sm">
                                                                        {childVariant.discountedPrice ? (
                                                                            <>
                                                                                <span className="text-red-600 font-semibold">${childVariant.discountedPrice.toString()}</span>
                                                                                <span className="text-gray-400 line-through ml-2 text-xs">${childVariant.price.toString()}</span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="font-semibold text-gray-900">${childVariant.price.toString()}</span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-gray-400">-</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-2">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                                                                    {childVariant.referralPercentage}%
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-2">
                                                                <span className="text-xs text-green-700">Stock: {childVariant.inventoryQuantity}</span>
                                                            </td>
                                                            <td className="px-6 py-2"></td>
                                                        </tr>
                                                    ))}
                                                </Fragment>
                                            );
                                        })
                                    )}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingProduct ? 'Edit Product' : 'Create Product'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingProduct(null);
                                    setFormData({
                                        title: '',
                                        slug: '',
                                        description: '',
                                        categoryId: '',
                                        tagId: '',
                                        price: '',
                                        sku: '',
                                        inventoryQuantity: '',
                                        referralPercentage: '',
                                        published: false,
                                    });
                                    setVariants([]);
                                    setShowVariants(false);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AdminInput
                                label="Product Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter product title"
                                required
                            />

                            <AdminInput
                                label="Slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="product-slug"
                                required
                            />

                            <AdminTextarea
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Product description..."
                                rows={4}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tag
                                    </label>
                                    <select
                                        value={formData.tagId}
                                        onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select tag</option>
                                        {tags.map((tag) => (
                                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {!showVariants && (
                                <div className="grid grid-cols-3 gap-4">
                                    <AdminInput
                                        label="Price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                    />

                                    <AdminInput
                                        label="SKU"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        placeholder="SKU-001"
                                    />

                                    <AdminInput
                                        label="Inventory"
                                        type="number"
                                        value={formData.inventoryQuantity}
                                        onChange={(e) => setFormData({ ...formData, inventoryQuantity: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            )}

                            {!showVariants && (
                                <AdminInput
                                    label="Referral Percentage (%)"
                                    type="number"
                                    value={formData.referralPercentage}
                                    onChange={(e) => setFormData({ ...formData, referralPercentage: e.target.value })}
                                    placeholder="10.0"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                />
                            )}

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                    />
                                    <label htmlFor="published" className="text-sm text-gray-700">
                                        Publish
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="hasVariants"
                                        checked={showVariants}
                                        onChange={(e) => {
                                            setShowVariants(e.target.checked);
                                            if (e.target.checked && variants.length === 0) {
                                                addVariant();
                                            }
                                        }}
                                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                    />
                                    <label htmlFor="hasVariants" className="text-sm text-gray-700">
                                        This product has variants
                                    </label>
                                </div>
                            </div>

                            {showVariants && (
                                <div className="border-t pt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">Product Variants</h3>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => addVariant(true)}
                                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                                            >
                                                + Add Standalone Variant
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => addVariant(false)}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                + Add Parent Variant
                                            </button>
                                        </div>
                                    </div>

                                    {variants.map((parentVariant, parentIndex) => (
                                        <div key={parentIndex} className={`border rounded-lg p-4 space-y-4 ${parentVariant.isStandalone ? 'border-green-200 bg-green-50' : 'border-gray-200'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {parentVariant.isStandalone ? 'Standalone Variant' : 'Parent Variant'} {parentIndex + 1}
                                                    </span>
                                                    <label className="flex items-center gap-2 text-xs text-gray-600">
                                                        <input
                                                            type="checkbox"
                                                            checked={parentVariant.isStandalone || false}
                                                            onChange={(e) => {
                                                                const updated = [...variants];
                                                                updated[parentIndex] = {
                                                                    ...updated[parentIndex],
                                                                    isStandalone: e.target.checked,
                                                                    children: e.target.checked && updated[parentIndex].children.length === 0 ? [{
                                                                        title: '',
                                                                        sku: '',
                                                                        price: '',
                                                                        discountedPrice: '',
                                                                        inventoryQuantity: '',
                                                                        referralPercentage: '',
                                                                    }] : updated[parentIndex].children
                                                                };
                                                                setVariants(updated);
                                                            }}
                                                            className="w-3 h-3 text-green-600 rounded focus:ring-green-500"
                                                        />
                                                        Standalone (no children)
                                                    </label>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(parentIndex)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {!parentVariant.isStandalone && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <AdminInput
                                                        label="Parent Title (e.g., Small, Large, XL)"
                                                        value={parentVariant.title}
                                                        onChange={(e) => updateVariant(parentIndex, 'title', e.target.value)}
                                                        placeholder="Small"
                                                        required={showVariants}
                                                    />
                                                </div>
                                            )}

                                            <div className="border-t pt-3 space-y-3">
                                                {!parentVariant.isStandalone && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-gray-600">Child Variants (Options)</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => addChildVariant(parentIndex)}
                                                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                        >
                                                            + Add Child Option
                                                        </button>
                                                    </div>
                                                )}

                                                {parentVariant.children.map((child, childIndex) => (
                                                    <div key={childIndex} className={`border rounded-lg p-3 space-y-2 ${parentVariant.isStandalone ? 'bg-white border-green-300' : 'bg-blue-50 border-blue-200'
                                                        }`}>
                                                        <div className="flex items-center justify-between">
                                                            <span className={`text-xs font-medium ${parentVariant.isStandalone ? 'text-green-700' : 'text-blue-700'
                                                                }`}>
                                                                {parentVariant.isStandalone ? 'Standalone Variant Details' : `${parentVariant.title || 'Parent'} / Child ${childIndex + 1}`}
                                                            </span>
                                                            {!parentVariant.isStandalone && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeChildVariant(parentIndex, childIndex)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="mb-2">
                                                            <AdminInput
                                                                label={parentVariant.isStandalone ? 'Variant Title' : 'Title (e.g., Single Unit, 5-Pack)'}
                                                                value={child.title}
                                                                onChange={(e) => updateChildVariant(parentIndex, childIndex, 'title', e.target.value)}
                                                                placeholder={parentVariant.isStandalone ? 'e.g., Blue / Medium' : 'Single Unit'}
                                                                required={showVariants}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <AdminInput
                                                                label="SKU"
                                                                value={child.sku}
                                                                onChange={(e) => updateChildVariant(parentIndex, childIndex, 'sku', e.target.value)}
                                                                placeholder="SKU-001"
                                                            />
                                                            <AdminInput
                                                                label="Inventory"
                                                                type="number"
                                                                value={child.inventoryQuantity}
                                                                onChange={(e) => updateChildVariant(parentIndex, childIndex, 'inventoryQuantity', e.target.value)}
                                                                placeholder="0"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <AdminInput
                                                                label="Price"
                                                                type="number"
                                                                value={child.price}
                                                                onChange={(e) => updateChildVariant(parentIndex, childIndex, 'price', e.target.value)}
                                                                placeholder="0.00"
                                                            />
                                                            <AdminInput
                                                                label="Discounted Price"
                                                                type="number"
                                                                value={child.discountedPrice}
                                                                onChange={(e) => updateChildVariant(parentIndex, childIndex, 'discountedPrice', e.target.value)}
                                                                placeholder="0.00"
                                                            />
                                                        </div>

                                                        <AdminInput
                                                            label="Referral Percentage (%)"
                                                            type="number"
                                                            step="0.01"
                                                            value={child.referralPercentage}
                                                            onChange={(e) => updateChildVariant(parentIndex, childIndex, 'referralPercentage', e.target.value)}
                                                            placeholder="10.00"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <AdminButton
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    variant="secondary"
                                    className="flex-1"
                                    disabled={submitting}
                                >
                                    Cancel
                                </AdminButton>
                                <AdminButton type="submit" className="flex-1" disabled={submitting}>
                                    {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, product: null, deleting: false })}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                message="Are you sure you want to delete"
                itemName={deleteModal.product?.title}
                isDeleting={deleteModal.deleting}
            />

            {/* Sync Confirmation Modal */}
            <ConfirmationModal
                isOpen={syncModal.show}
                onClose={() => setSyncModal({ show: false, confirming: false })}
                onConfirm={handleSyncShopify}
                title="Sync Products"
                message="Sync products from Shopify? This may take a few moments and will update existing products with matching Shopify IDs."
                confirmText="Sync Now"
                cancelText="Cancel"
                isProcessing={syncModal.confirming}
                variant="success"
            />

            {/* Sync Result Modal */}
            {syncResultModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${syncResultModal.success ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {syncResultModal.success ? (
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <X className="w-6 h-6 text-red-600" />
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {syncResultModal.success ? 'Sync Complete' : 'Sync Failed'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setSyncResultModal({ show: false, success: false, message: '', data: null })}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 text-lg mb-4">
                                {syncResultModal.message}
                            </p>
                            {syncResultModal.success && syncResultModal.data && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Created:</span>
                                        <span className="font-semibold text-gray-900">{syncResultModal.data.created}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Updated:</span>
                                        <span className="font-semibold text-gray-900">{syncResultModal.data.updated}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 pt-2">
                                        <span className="text-gray-600">Total:</span>
                                        <span className="font-semibold text-gray-900">{syncResultModal.data.total}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSyncResultModal({ show: false, success: false, message: '', data: null })}
                            className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
