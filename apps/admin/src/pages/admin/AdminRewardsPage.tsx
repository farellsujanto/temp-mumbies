import { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Trash2, DollarSign, Gift, Users, TrendingUp, CheckCircle, Upload, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';

interface Reward {
  id: string;
  title: string;
  description: string;
  reward_type: string;
  reward_value: number;
  reward_description: string;
  requirement_type: string;
  requirement_value: number;
  requirement_description: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  max_winners: number | null;
  current_participants: number;
  featured: boolean;
  badge_color: string | null;
  product_id: string | null;
  featured_image_url: string | null;
  sort_order: number;
}

interface RewardFormData {
  title: string;
  description: string;
  reward_type: string;
  reward_value: number;
  reward_description: string;
  requirement_type: string;
  requirement_value: number;
  requirement_description: string;
  status: string;
  ends_at: string;
  featured: boolean;
  badge_color: string;
  product_id: string;
  featured_image_url: string;
}

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RewardFormData>({
    title: '',
    description: '',
    reward_type: 'cash_bonus',
    reward_value: 0,
    reward_description: '',
    requirement_type: 'sales_amount',
    requirement_value: 0,
    requirement_description: '',
    status: 'active',
    ends_at: '',
    featured: false,
    badge_color: 'green',
    product_id: '',
    featured_image_url: ''
  });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('partner_rewards')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data) setRewards(data);
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingReward(null);
    setFormData({
      title: '',
      description: '',
      reward_type: 'cash_bonus',
      reward_value: 0,
      reward_description: '',
      requirement_type: 'sales_amount',
      requirement_value: 0,
      requirement_description: '',
      status: 'active',
      ends_at: '',
      featured: false,
      badge_color: 'green',
      product_id: '',
      featured_image_url: ''
    });
    setShowModal(true);
  };

  const openEditModal = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      reward_type: reward.reward_type,
      reward_value: reward.reward_value,
      reward_description: reward.reward_description,
      requirement_type: reward.requirement_type,
      requirement_value: reward.requirement_value,
      requirement_description: reward.requirement_description,
      status: reward.status,
      ends_at: reward.ends_at ? reward.ends_at.split('T')[0] : '',
      featured: reward.featured,
      badge_color: reward.badge_color || 'green',
      product_id: reward.product_id || '',
      featured_image_url: reward.featured_image_url || ''
    });
    setShowModal(true);
  };

  const saveReward = async () => {
    const rewardData = {
      ...formData,
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
      product_id: formData.product_id || null
    };

    if (editingReward) {
      await supabase
        .from('partner_rewards')
        .update(rewardData)
        .eq('id', editingReward.id);
    } else {
      await supabase
        .from('partner_rewards')
        .insert(rewardData);
    }

    setShowModal(false);
    fetchRewards();
  };

  const deleteReward = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    await supabase
      .from('partner_rewards')
      .delete()
      .eq('id', id);

    fetchRewards();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be less than 2MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `reward-${Date.now()}.${fileExt}`;
      const filePath = `rewards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, featured_image_url: data.publicUrl });
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'cash_bonus': return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'free_product': return <Gift className="h-5 w-5 text-blue-600" />;
      case 'mumbies_cash_bonus': return <TrendingUp className="h-5 w-5 text-purple-600" />;
      default: return <Trophy className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRequirementIcon = (type: string) => {
    switch (type) {
      case 'sales_amount':
      case 'sales_count': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'lead_count':
      case 'referral_count': return <Users className="h-4 w-4 text-blue-600" />;
      default: return <Trophy className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rewards Management</h1>
            <p className="text-gray-600 mt-1">Create and manage partner challenges</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Reward
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Rewards</span>
              <Trophy className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">{rewards.length}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Active</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">{rewards.filter(r => r.status === 'active').length}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Featured</span>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{rewards.filter(r => r.featured).length}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Participants</span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{rewards.reduce((sum, r) => sum + r.current_participants, 0)}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Challenge</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Reward</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Requirement</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Participants</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </td>
                </tr>
              ) : rewards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No rewards created yet
                  </td>
                </tr>
              ) : (
                rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getRewardTypeIcon(reward.reward_type)}
                        <div>
                          <div className="font-semibold text-gray-900">{reward.title}</div>
                          <div className="text-sm text-gray-500">{reward.description}</div>
                          {reward.featured && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">{reward.reward_description}</div>
                        <div className="text-gray-500">${reward.reward_value.toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRequirementIcon(reward.requirement_type)}
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{reward.requirement_description}</div>
                          <div className="text-gray-500">{reward.requirement_value.toFixed(0)} {reward.requirement_type.replace('_', ' ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        reward.status === 'active' ? 'bg-green-100 text-green-700' :
                        reward.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {reward.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-gray-900">{reward.current_participants}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(reward)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReward(reward.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingReward ? 'Edit Reward' : 'Create Reward'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., First $500 in Sales"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reward Type</label>
                  <select
                    value={formData.reward_type}
                    onChange={(e) => setFormData({ ...formData, reward_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="cash_bonus">Cash Bonus</option>
                    <option value="mumbies_cash_bonus">Mumbies Cash</option>
                    <option value="free_product">Free Product</option>
                    <option value="gift_card">Gift Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reward Value ($)</label>
                  <input
                    type="number"
                    value={formData.reward_value}
                    onChange={(e) => setFormData({ ...formData, reward_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Description</label>
                <input
                  type="text"
                  value={formData.reward_description}
                  onChange={(e) => setFormData({ ...formData, reward_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., $50 Cash Bonus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>

                {formData.featured_image_url ? (
                  <div className="space-y-3">
                    <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={formData.featured_image_url}
                        alt="Featured"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => setFormData({ ...formData, featured_image_url: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">{formData.featured_image_url}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label className="cursor-pointer">
                            <span className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium inline-flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              {uploading ? 'Uploading...' : 'Upload Image'}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Recommended: 800x600px • Max: 2MB • JPG, PNG, or WebP
                        </p>
                      </div>
                    </div>
                    {uploadError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">{uploadError}</p>
                      </div>
                    )}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Or</strong> paste a Pexels image URL below:
                      </p>
                      <input
                        type="url"
                        value={formData.featured_image_url}
                        onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                        className="w-full mt-2 px-3 py-2 border border-blue-300 rounded-lg text-sm"
                        placeholder="https://images.pexels.com/photos/..."
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirement Type</label>
                  <select
                    value={formData.requirement_type}
                    onChange={(e) => setFormData({ ...formData, requirement_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="sales_amount">Sales Amount ($)</option>
                    <option value="sales_count">Sales Count</option>
                    <option value="lead_count">Lead Count</option>
                    <option value="referral_count">Referral Count</option>
                    <option value="customer_count">Customer Count</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirement Value</label>
                  <input
                    type="number"
                    value={formData.requirement_value}
                    onChange={(e) => setFormData({ ...formData, requirement_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirement Description</label>
                <input
                  type="text"
                  value={formData.requirement_description}
                  onChange={(e) => setFormData({ ...formData, requirement_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Generate $500 in tracked sales"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge Color</label>
                  <select
                    value={formData.badge_color}
                    onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="amber">Amber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 text-purple-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Show as featured</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveReward}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                {editingReward ? 'Update' : 'Create'} Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
