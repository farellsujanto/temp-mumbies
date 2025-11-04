import { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Eye, Trash2, Copy } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '@mumbies/shared';

interface LandingPageTemplate {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  hero_image_url: string;
  cta_text: string;
  offers: Array<{
    id: string;
    title: string;
    description: string;
    image_url: string;
  }>;
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
      title: 'Join the Pack and Save!',
      subtitle: 'Special offer for dog lovers',
      description: 'Get an exclusive welcome offer when you join our community',
      hero_image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      cta_text: 'Claim My Offer',
      offers: [
        {
          id: 'free-chew',
          title: 'Free Chew Sample',
          description: 'Try our best-selling chew',
          image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
        },
        {
          id: 'starter-pack',
          title: 'Starter Pack - 50% Off',
          description: 'Perfect for first-time customers',
          image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
        },
        {
          id: 'bundle',
          title: 'Ultimate Bundle',
          description: 'Best value for multi-dog homes',
          image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
        }
      ],
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
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${template.hero_image_url})` }}
                >
                  {template.is_active && (
                    <div className="bg-green-600 text-white px-3 py-1 text-sm font-medium inline-block m-3 rounded">
                      Active
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{template.title}</p>
                  <p className="text-xs text-gray-500 mb-4">{template.subtitle}</p>

                  <div className="flex items-center gap-2">
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
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {formData.id ? 'Edit Template' : 'Create Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Image URL
            </label>
            <input
              type="text"
              value={formData.hero_image_url}
              onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Button Text
            </label>
            <input
              type="text"
              value={formData.cta_text}
              onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={formData.background_color}
                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={formData.text_color}
                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Color
              </label>
              <input
                type="color"
                value={formData.button_color}
                onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
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

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-4">
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
    </div>
  );
}
