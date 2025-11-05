import { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, Copy, Eye, Package, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '@mumbies/shared';

interface Offer {
  id: string;
  title: string;
  description: string;
  product_id?: string | null;
  image_url: string;
  badge: string | null;
  badge_color: 'red' | 'amber' | 'green' | 'blue';
  price_display: string;
  price_subtext: string;
  discount_type: 'free' | 'percentage' | 'fixed';
  discount_value: string;
  button_color: 'red' | 'amber' | 'green' | 'blue';
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  price: number;
  brand_id: string | null;
}

interface LandingPageTemplate {
  id: string;
  name: string;
  slug: string;

  // Header Section
  header_gradient_from: string;
  header_gradient_to: string;
  show_partner_logo: boolean;
  main_headline: string;
  sub_headline: string;

  // Offer Section
  offer_section_title: string;
  offer_section_description: string;
  offers: Offer[];

  // Email Form
  email_placeholder: string;
  submit_button_text: string;

  // Success Page
  success_title: string;
  success_message: string;

  // Colors
  background_color: string;
  text_color: string;
  button_color: string;

  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminLandingPagesPage() {
  const [templates, setTemplates] = useState<LandingPageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LandingPageTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<LandingPageTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('landing_page_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTemplates(data);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingTemplate({
      id: '',
      name: 'New Template',
      slug: '',
      header_gradient_from: '#16a34a',
      header_gradient_to: '#15803d',
      show_partner_logo: true,
      main_headline: 'Shop for Your Pet Essentials at Mumbies',
      sub_headline: '& Automatically Donate for Life to',
      offer_section_title: 'Pick an Offer Below',
      offer_section_description: 'Choose your deal and start shopping premium natural pet products',
      offers: [
        {
          id: 'offer-1',
          title: 'Special Offer',
          description: 'Limited time deal',
          image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
          badge: null,
          badge_color: 'green',
          price_display: '$0.00',
          price_subtext: '+ shipping',
          discount_type: 'free',
          discount_value: '100',
          button_color: 'green'
        }
      ],
      email_placeholder: 'Enter your email address',
      submit_button_text: 'Claim My Offer',
      success_title: 'Success! 🎉',
      success_message: 'Your offer has been claimed! Check your email to complete your registration.',
      background_color: '#ffffff',
      text_color: '#1f2937',
      button_color: '#16a34a',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setShowEditor(true);
  };

  const handleEdit = (template: LandingPageTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    const { error } = await supabase
      .from('landing_page_templates')
      .delete()
      .eq('id', id);

    if (!error) {
      loadTemplates();
    }
  };

  const handleDuplicate = async (template: LandingPageTemplate) => {
    const newTemplate = {
      ...template,
      id: undefined,
      name: `${template.name} (Copy)`,
      slug: `${template.slug}-copy`,
      is_active: false
    };

    const { error } = await supabase
      .from('landing_page_templates')
      .insert([newTemplate]);

    if (!error) {
      loadTemplates();
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Landing Pages</h1>
            <p className="text-gray-600 mt-2">
              Manage landing page templates that partners can deploy
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Template
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="text-gray-600 mt-4">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first landing page template to get started
            </p>
            <button
              onClick={handleCreate}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-40 flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    background: `linear-gradient(to right, ${template.header_gradient_from}, ${template.header_gradient_to})`
                  }}
                >
                  {template.main_headline}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                    {template.is_active && (
                      <span className="bg-green-600 text-white px-3 py-1 text-sm font-medium rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Slug: /{template.slug}</p>
                  <p className="text-xs text-gray-500 mb-4">{template.offers.length} offers configured</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleEdit(template)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(template)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showEditor && editingTemplate && (
          <TemplateEditor
            template={editingTemplate}
            onClose={() => {
              setShowEditor(false);
              setEditingTemplate(null);
            }}
            onSave={() => {
              setShowEditor(false);
              setEditingTemplate(null);
              loadTemplates();
            }}
          />
        )}

        {previewTemplate && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Preview: {previewTemplate.name}</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6" style={{ backgroundColor: previewTemplate.background_color }}>
                {/* Header Section */}
                <div
                  className="rounded-lg p-12 text-center mb-8"
                  style={{
                    background: `linear-gradient(135deg, ${previewTemplate.header_gradient_from} 0%, ${previewTemplate.header_gradient_to} 100%)`
                  }}
                >
                  <h1 className="text-4xl font-bold text-white mb-4">{previewTemplate.main_headline}</h1>
                  <h2 className="text-xl text-white/90">{previewTemplate.sub_headline}</h2>
                  {previewTemplate.show_partner_logo && (
                    <div className="mt-4 text-white/80 text-sm">
                      [Partner Logo Would Appear Here]
                    </div>
                  )}
                </div>

                {/* Offers Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-center mb-2" style={{ color: previewTemplate.text_color }}>
                    {previewTemplate.offer_section_title}
                  </h3>
                  <p className="text-center mb-6" style={{ color: previewTemplate.text_color }}>
                    {previewTemplate.offer_section_description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {previewTemplate.offers.map((offer, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-lg p-6 relative">
                        {offer.badge && (
                          <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold text-white bg-${offer.badge_color}-500`}>
                            {offer.badge}
                          </div>
                        )}
                        <img
                          src={offer.image_url || 'https://via.placeholder.com/300x200'}
                          alt={offer.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h4 className="text-xl font-bold mb-2">{offer.title}</h4>
                        <p className="text-gray-600 mb-4 text-sm">{offer.description}</p>
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-green-600">{offer.price_display}</div>
                          <div className="text-sm text-gray-500">{offer.price_subtext}</div>
                        </div>
                        <button
                          className={`w-full py-3 px-4 rounded-lg font-semibold text-white bg-${offer.button_color}-500 hover:bg-${offer.button_color}-600 transition-colors`}
                        >
                          {offer.discount_type === 'free' ? 'Get Free Sample' : 'Shop Now'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Form Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-center mb-6">Get Started</h3>
                  <div className="flex gap-4">
                    <input
                      type="email"
                      placeholder={previewTemplate.email_placeholder}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                      disabled
                    />
                    <button
                      className="px-8 py-3 rounded-lg font-semibold text-white"
                      style={{ backgroundColor: previewTemplate.button_color }}
                      disabled
                    >
                      {previewTemplate.submit_button_text}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 p-4">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

interface TemplateEditorProps {
  template: LandingPageTemplate;
  onClose: () => void;
  onSave: () => void;
}

function TemplateEditor({ template, onClose, onSave }: TemplateEditorProps) {
  const [formData, setFormData] = useState(template);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'header' | 'offers' | 'form' | 'success'>('basic');
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectingForOfferIndex, setSelectingForOfferIndex] = useState<number | null>(null);

  const handleSave = async () => {
    setSaving(true);

    const dataToSave = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    let error;
    if (formData.id) {
      ({ error } = await supabase
        .from('landing_page_templates')
        .update(dataToSave)
        .eq('id', formData.id));
    } else {
      ({ error } = await supabase
        .from('landing_page_templates')
        .insert([dataToSave]));
    }

    setSaving(false);

    if (!error) {
      onSave();
    } else {
      alert('Error saving template: ' + error.message);
    }
  };

  const updateOffer = (index: number, updates: Partial<Offer>) => {
    const newOffers = [...formData.offers];
    newOffers[index] = { ...newOffers[index], ...updates };
    setFormData({ ...formData, offers: newOffers });
  };

  const addOffer = () => {
    setFormData({
      ...formData,
      offers: [
        ...formData.offers,
        {
          id: `offer-${formData.offers.length + 1}`,
          title: 'New Offer',
          description: 'Description',
          image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
          badge: null,
          badge_color: 'green',
          price_display: '$0.00',
          price_subtext: '',
          discount_type: 'free',
          discount_value: '0',
          button_color: 'green'
        }
      ]
    });
  };

  const removeOffer = (index: number) => {
    setFormData({
      ...formData,
      offers: formData.offers.filter((_, i) => i !== index)
    });
  };

  const handleSelectProduct = (product: Product) => {
    if (selectingForOfferIndex !== null) {
      updateOffer(selectingForOfferIndex, {
        product_id: product.id,
        image_url: product.image_url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
        title: product.name
      });
      setShowProductSelector(false);
      setSelectingForOfferIndex(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {formData.id ? 'Edit Template' : 'Create Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-gray-200 px-6">
          <nav className="flex gap-4">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'header', label: 'Header Design' },
              { id: 'offers', label: 'Offer Cards' },
              { id: 'form', label: 'Email Form' },
              { id: 'success', label: 'Success Page' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="adoption-offer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Partners will use: /lead-registration?template={formData.slug}&ref=partner-slug
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Set as active template
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'header' && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Gradient Start
                  </label>
                  <input
                    type="color"
                    value={formData.header_gradient_from}
                    onChange={(e) => setFormData({ ...formData, header_gradient_from: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Gradient End
                  </label>
                  <input
                    type="color"
                    value={formData.header_gradient_to}
                    onChange={(e) => setFormData({ ...formData, header_gradient_to: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.show_partner_logo}
                    onChange={(e) => setFormData({ ...formData, show_partner_logo: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Show partner logo in header
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={formData.main_headline}
                  onChange={(e) => setFormData({ ...formData, main_headline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Headline
                </label>
                <input
                  type="text"
                  value={formData.sub_headline}
                  onChange={(e) => setFormData({ ...formData, sub_headline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div
                  className="w-full h-48 rounded-lg flex flex-col items-center justify-center text-white p-8 text-center"
                  style={{
                    background: `linear-gradient(to right, ${formData.header_gradient_from}, ${formData.header_gradient_to})`
                  }}
                >
                  <h1 className="text-2xl font-bold mb-2">{formData.main_headline}</h1>
                  <p className="text-lg opacity-90">{formData.sub_headline}</p>
                  <p className="text-xl font-bold mt-2">[Partner Organization Name]</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.offer_section_title}
                  onChange={(e) => setFormData({ ...formData, offer_section_title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Description
                </label>
                <textarea
                  value={formData.offer_section_description}
                  onChange={(e) => setFormData({ ...formData, offer_section_description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between border-t pt-6">
                <h3 className="text-lg font-semibold">Offer Cards ({formData.offers.length})</h3>
                <button
                  onClick={addOffer}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Offer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.offers.map((offer, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Offer {index + 1}</h4>
                      <button
                        onClick={() => removeOffer(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">ID</label>
                      <input
                        type="text"
                        value={offer.id}
                        onChange={(e) => updateOffer(index, { id: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectingForOfferIndex(index);
                          setShowProductSelector(true);
                        }}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Package className="h-4 w-4" />
                        Select from Products
                      </button>
                      {offer.product_id && (
                        <p className="text-xs text-gray-500 mt-1">Product ID: {offer.product_id.substring(0, 8)}...</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={offer.title}
                        onChange={(e) => updateOffer(index, { title: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={offer.description}
                        onChange={(e) => updateOffer(index, { description: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={offer.image_url}
                        onChange={(e) => updateOffer(index, { image_url: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Badge Text (optional)</label>
                      <input
                        type="text"
                        value={offer.badge || ''}
                        onChange={(e) => updateOffer(index, { badge: e.target.value || null })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                        placeholder="POPULAR"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Badge Color</label>
                      <select
                        value={offer.badge_color}
                        onChange={(e) => updateOffer(index, { badge_color: e.target.value as any })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                      >
                        <option value="red">Red</option>
                        <option value="amber">Amber</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Price Display</label>
                      <input
                        type="text"
                        value={offer.price_display}
                        onChange={(e) => updateOffer(index, { price_display: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                        placeholder="$0.00 or 50% OFF"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Price Subtext</label>
                      <input
                        type="text"
                        value={offer.price_subtext}
                        onChange={(e) => updateOffer(index, { price_subtext: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                        placeholder="+ shipping"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Color</label>
                      <select
                        value={offer.button_color}
                        onChange={(e) => updateOffer(index, { button_color: e.target.value as any })}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                      >
                        <option value="red">Red</option>
                        <option value="amber">Amber</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'form' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Placeholder Text
                </label>
                <input
                  type="text"
                  value={formData.email_placeholder}
                  onChange={(e) => setFormData({ ...formData, email_placeholder: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submit Button Text
                </label>
                <input
                  type="text"
                  value={formData.submit_button_text}
                  onChange={(e) => setFormData({ ...formData, submit_button_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          )}

          {activeTab === 'success' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Page Title
                </label>
                <input
                  type="text"
                  value={formData.success_title}
                  onChange={(e) => setFormData({ ...formData, success_title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Message
                </label>
                <textarea
                  value={formData.success_message}
                  onChange={(e) => setFormData({ ...formData, success_message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>

      {showProductSelector && (
        <ProductSelectorModal
          onSelect={handleSelectProduct}
          onClose={() => {
            setShowProductSelector(false);
            setSelectingForOfferIndex(null);
          }}
        />
      )}
    </div>
  );
}

interface ProductSelectorModalProps {
  onSelect: (product: Product) => void;
  onClose: () => void;
}

function ProductSelectorModal({ onSelect, onClose }: ProductSelectorModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, image_url, price, brand_id')
      .order('name', { ascending: true })
      .limit(100);

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Select Product</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onSelect(product)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all text-left"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
