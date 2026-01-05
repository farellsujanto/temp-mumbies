'use client';

import { useState, useEffect } from 'react';
import { Check, X, UserCheck, Loader2 } from 'lucide-react';
import AdminButton from '@/src/components/AdminButton';
import { ApprovalStatus, PartnerTag as PrismaPartnerTag, User as PrismaUser } from '@/generated/prisma/client';

interface PartnerTag extends PrismaPartnerTag {
  _count?: {
    users: number;
  };
}

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  partnerTagId: number | null;
  partnerTag: PartnerTag | null;
}

interface Answer {
  id: number;
  question: string;
  answer: string;
}

interface PartnerApplication {
  id: number;
  userId: number;
  user: User;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  approvalStatus: ApprovalStatus;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}

type TabType = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export default function PartnerApplicationsPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [partnerTags, setPartnerTags] = useState<PartnerTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('PENDING');
  const [processing, setProcessing] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<{ [key: number]: number }>({});
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchApplications(activeTab);
    fetchPartnerTags();
  }, [activeTab]);

  const fetchApplications = async (status: TabType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/partner-applications?status=${status}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data.applications);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerTags = async () => {
    try {
      const res = await fetch('/api/v1/admin/partner-tags');
      const data = await res.json();
      if (data.success) {
        setPartnerTags(data.data);
      }
    } catch (error) {
      console.error('Error fetching partner tags:', error);
    }
  };

  const handleApproval = async (applicationId: number, status: 'ACCEPTED' | 'DECLINED') => {
    if (status === 'ACCEPTED' && !selectedTag[applicationId]) {
      alert('Please select a partner tag before accepting');
      return;
    }

    setProcessing(applicationId);
    try {
      const res = await fetch('/api/v1/admin/partner-applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: applicationId,
          approvalStatus: status,
          partnerTagId: status === 'ACCEPTED' ? selectedTag[applicationId] : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchApplications(activeTab);
        setSelectedTag(prev => {
          const updated = { ...prev };
          delete updated[applicationId];
          return updated;
        });
      } else {
        alert(data.message || 'Failed to update application');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs: { key: TabType; label: string; color: string }[] = [
    { key: 'PENDING', label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
    { key: 'ACCEPTED', label: 'Accepted', color: 'text-green-600 bg-green-100' },
    { key: 'DECLINED', label: 'Declined', color: 'text-red-600 bg-red-100' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Applications</h1>
        <p className="text-gray-600">Review and manage partner applications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No {activeTab.toLowerCase()} applications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {app.user.name || 'Unnamed User'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tabs.find(t => t.key === app.approvalStatus)?.color
                      }`}>
                        {app.approvalStatus}
                      </span>
                      {app.user.partnerTag && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                          {app.user.partnerTag.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{app.user.email}</p>
                    <p className="text-xs text-gray-500">Applied: {formatDate(app.createdAt)}</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {app.instagramUrl && (
                    <a href={app.instagramUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-sm text-blue-600 hover:underline truncate">
                      📷 Instagram
                    </a>
                  )}
                  {app.tiktokUrl && (
                    <a href={app.tiktokUrl} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-blue-600 hover:underline truncate">
                      🎵 TikTok
                    </a>
                  )}
                  {app.facebookUrl && (
                    <a href={app.facebookUrl} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-blue-600 hover:underline truncate">
                      👥 Facebook
                    </a>
                  )}
                  {app.youtubeUrl && (
                    <a href={app.youtubeUrl} target="_blank" rel="noopener noreferrer"
                       className="text-sm text-blue-600 hover:underline truncate">
                      ▶️ YouTube
                    </a>
                  )}
                </div>

                {/* Answers */}
                {app.answers.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {expandedApp === app.id ? 'Hide' : 'Show'} Application Answers ({app.answers.length})
                    </button>
                    {expandedApp === app.id && (
                      <div className="mt-3 space-y-3 bg-gray-50 p-4 rounded-xl">
                        {app.answers.map(answer => (
                          <div key={answer.id}>
                            <p className="text-sm font-medium text-gray-900 mb-1">{answer.question}</p>
                            <p className="text-sm text-gray-600">{answer.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions for Pending */}
                {app.approvalStatus === 'PENDING' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <select
                      value={selectedTag[app.id] || ''}
                      onChange={(e) => setSelectedTag({ ...selectedTag, [app.id]: parseInt(e.target.value) })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Partner Tag</option>
                      {partnerTags.map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name} ({Number(tag.referralPercentage).toFixed(2)}%)
                        </option>
                      ))}
                    </select>
                    <AdminButton
                      onClick={() => handleApproval(app.id, 'ACCEPTED')}
                      disabled={processing === app.id || !selectedTag[app.id]}
                      variant="primary"
                      icon={processing === app.id ? Loader2 : Check}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </AdminButton>
                    <AdminButton
                      onClick={() => handleApproval(app.id, 'DECLINED')}
                      disabled={processing === app.id}
                      variant="danger"
                      icon={processing === app.id ? Loader2 : X}
                    >
                      Decline
                    </AdminButton>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
