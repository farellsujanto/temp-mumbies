import { useEffect, useState } from 'react';
import { supabase } from '@mumbies/shared';
import { FileText, Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Application {
  id: string;
  email: string;
  organization_name: string;
  organization_type: string;
  contact_name: string;
  status: string;
  application_date: string;
  reviewed_at: string | null;
  reviewed_by_email: string | null;
  review_notes: string | null;
  denial_reason: string | null;
  nonprofit_id: string | null;
}

export default function AdminPartnerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_partner_applications', {
        p_status: filter === 'all' ? null : filter
      });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId: string) => {
    const notes = prompt('Review notes (optional):');
    
    try {
      const { error } = await supabase.rpc('admin_approve_partner_application', {
        p_application_id: appId,
        p_review_notes: notes
      });

      if (error) throw error;

      alert('Application approved! Partner account created.');
      fetchApplications();
      setShowDetailModal(false);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeny = async (appId: string) => {
    const reason = prompt('Denial reason (required):');
    if (!reason) return;

    const notes = prompt('Additional review notes (optional):');

    try {
      const { error } = await supabase.rpc('admin_deny_partner_application', {
        p_application_id: appId,
        p_denial_reason: reason,
        p_review_notes: notes
      });

      if (error) throw error;

      alert('Application denied.');
      fetchApplications();
      setShowDetailModal(false);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Pending</span>;
      case 'under_review':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Under Review</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Approved</span>;
      case 'denied':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Denied</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{status}</span>;
    }
  };

  const stats = {
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    denied: applications.filter(a => a.status === 'denied').length,
    total: applications.length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Applications</h1>
          <p className="text-gray-600 mt-1">Review and approve partner applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-600">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600">Approved</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.approved}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">Denied</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{stats.denied}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === 'approved' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('denied')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === 'denied' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                Denied
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Organization</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Applied</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{app.organization_name}</p>
                        <p className="text-sm text-gray-500">{app.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{app.contact_name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">{app.organization_type}</td>
                      <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(app.application_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowDetailModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(app.id)}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeny(app.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"
                              >
                                <XCircle className="h-3 w-3" />
                                Deny
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDetailModal && selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setShowDetailModal(false)}
          onApprove={() => handleApprove(selectedApp.id)}
          onDeny={() => handleDeny(selectedApp.id)}
        />
      )}
    </AdminLayout>
  );
}

interface ApplicationDetailModalProps {
  application: Application;
  onClose: () => void;
  onApprove: () => void;
  onDeny: () => void;
}

function ApplicationDetailModal({ application, onClose, onApprove, onDeny }: ApplicationDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Organization Information</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-600">Organization Name</dt>
                <dd className="text-sm text-gray-900 mt-1">{application.organization_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Type</dt>
                <dd className="text-sm text-gray-900 mt-1 capitalize">{application.organization_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Contact Name</dt>
                <dd className="text-sm text-gray-900 mt-1">{application.contact_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Email</dt>
                <dd className="text-sm text-gray-900 mt-1">{application.email}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Status</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-600">Status</dt>
                <dd className="text-sm text-gray-900 mt-1 capitalize">{application.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Applied</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {new Date(application.application_date).toLocaleDateString()}
                </dd>
              </div>
              {application.reviewed_at && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Reviewed</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {new Date(application.reviewed_at).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Reviewed By</dt>
                    <dd className="text-sm text-gray-900 mt-1">{application.reviewed_by_email}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          {application.review_notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Notes</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{application.review_notes}</p>
            </div>
          )}

          {application.denial_reason && (
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Denial Reason</h3>
              <p className="text-sm text-red-700 bg-red-50 p-3 rounded border border-red-200">{application.denial_reason}</p>
            </div>
          )}

          {application.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={onDeny}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2"
              >
                <XCircle className="h-5 w-5" />
                Deny Application
              </button>
              <button
                onClick={onApprove}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                Approve Application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
