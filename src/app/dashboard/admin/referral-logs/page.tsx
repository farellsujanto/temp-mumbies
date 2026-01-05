'use client';

import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, DollarSign } from 'lucide-react';
import AdminButton from '@/src/components/AdminButton';
import { PartnerTag as PrismaPartnerTag, User as PrismaUser } from '@/generated/prisma/client';

interface User {
  id: number;
  name: string | null;
  email: string;
  referralCode?: string;
}

interface PartnerTag {
  id: number;
  name: string;
  referralPercentage: number;
}

interface ReferralLog {
  id: number;
  userId: number;
  user: User;
  codeUsed: string;
  refererId: number;
  referer: User;
  createdAt: string;
}

interface ReferralEarningsLog {
  id: number;
  userId: number;
  user: User;
  refererId: number;
  referer: User & { partnerTag: PartnerTag | null };
  shopifyOrderId: string | null;
  amount: number;
  partnerTagReferralEarnings: number | null;
  partnerTagName: string | null;
  createdAt: string;
}

type LogType = 'referrals' | 'earnings';

export default function ReferralLogsPage() {
  const [activeTab, setActiveTab] = useState<LogType>('referrals');
  const [referralLogs, setReferralLogs] = useState<ReferralLog[]>([]);
  const [earningsLogs, setEarningsLogs] = useState<ReferralEarningsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchLogs(activeTab, 0, true);
  }, [activeTab]);

  const fetchLogs = async (type: LogType, currentOffset: number, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const endpoint = type === 'referrals' 
        ? '/api/v1/admin/referral-logs'
        : '/api/v1/admin/referral-earnings-logs';
      
      const res = await fetch(`${endpoint}?limit=50&offset=${currentOffset}`);
      const data = await res.json();
      
      if (data.success) {
        const newLogs = data.data.logs;
        
        if (type === 'referrals') {
          setReferralLogs(reset ? newLogs : [...referralLogs, ...newLogs]);
        } else {
          setEarningsLogs(reset ? newLogs : [...earningsLogs, ...newLogs]);
        }
        
        setTotal(data.data.total);
        setHasMore(currentOffset + newLogs.length < data.data.total);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    const newOffset = offset + 50;
    setOffset(newOffset);
    fetchLogs(activeTab, newOffset);
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

  const currentLogs = activeTab === 'referrals' ? referralLogs : earningsLogs;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Logs</h1>
        <p className="text-gray-600">Track all referral activities and earnings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'referrals'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Referral Usage
          {activeTab === 'referrals' && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              {total}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'earnings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Referral Earnings
          {activeTab === 'earnings' && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              {total}
            </span>
          )}
        </button>
      </div>

      {/* Logs */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : currentLogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No logs found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'referrals' ? 'User (Buyer)' : 'User (Buyer)'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrer
                  </th>
                  {activeTab === 'referrals' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code Used
                    </th>
                  )}
                  {activeTab === 'earnings' && (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partner Tag
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                    </>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab === 'referrals' ? (
                  referralLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{log.user.name || 'Unnamed'}</div>
                          <div className="text-sm text-gray-500">{log.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{log.referer.name || 'Unnamed'}</div>
                          <div className="text-sm text-gray-500">{log.referer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-100 text-blue-600">
                          {log.codeUsed}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  earningsLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{log.user.name || 'Unnamed'}</div>
                          <div className="text-sm text-gray-500">{log.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{log.referer.name || 'Unnamed'}</div>
                          <div className="text-sm text-gray-500">{log.referer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-green-600 font-bold">
                          <DollarSign className="w-4 h-4" />
                          {(log?.amount ?? 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.partnerTagName ? (
                          <div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                              {log.partnerTagName}
                            </span>
                            {log.partnerTagReferralEarnings && (
                              <div className="text-xs text-gray-500 mt-1">
                                +${log.partnerTagReferralEarnings.toFixed(2)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.shopifyOrderId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-6 text-center">
              <AdminButton
                onClick={loadMore}
                disabled={loadingMore}
                variant="primary"
                icon={loadingMore ? Loader2 : RefreshCw}
                className="mx-auto"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </AdminButton>
              <p className="text-sm text-gray-500 mt-2">
                Showing {currentLogs.length} of {total} logs
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
