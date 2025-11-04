import { useState, useEffect } from 'react';
import { useDebug } from '../contexts/DebugContext';
import { useAuth, supabase } from '@mumbies/shared';
import {
  Bug,
  X,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Copy,
  Trash2,
  Database,
  User,
  Building2,
} from 'lucide-react';

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'query' | 'data' | 'error'>('all');
  const [position, setPosition] = useState({ x: window.innerWidth - 700, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { entries, clear, logInfo, logQuery } = useDebug();
  const { user } = useAuth();
  const [nonprofitInfo, setNonprofitInfo] = useState<any>(null);

  useEffect(() => {
    if (user && !nonprofitInfo) {
      loadNonprofitInfo();
    }
  }, [user]);

  const loadNonprofitInfo = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('nonprofits')
        .select('id, organization_name, status, mumbies_cash_balance')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (data) {
        setNonprofitInfo(data);
        logInfo('Nonprofit loaded', data);
      }
    } catch (err: any) {
      console.error('Debug panel error loading nonprofit:', err);
    }
  };

  const toggleEntry = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyDebugInfo = () => {
    const debugInfo = {
      user: {
        id: user?.id,
        email: user?.email,
      },
      nonprofit: nonprofitInfo,
      entries: entries.slice(0, 10),
      timestamp: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    logInfo('Debug info copied to clipboard');
  };

  const testLeadsQuery = async () => {
    if (!nonprofitInfo) {
      logInfo('No nonprofit loaded yet');
      return;
    }

    logInfo('Testing leads query...', { partnerId: nonprofitInfo.id });

    const query = supabase
      .from('partner_leads')
      .select('*')
      .eq('partner_id', nonprofitInfo.id)
      .order('expires_at', { ascending: true });

    const { data, error } = await query;

    logQuery('partner_leads', { partnerId: nonprofitInfo.id }, data, error);
  };

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    return entry.type === filter;
  });

  const errorCount = entries.filter(e => e.type === 'error').length;
  const queryCount = entries.filter(e => e.type === 'query' || e.type === 'success').length;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Only show in non-production environments
  if (import.meta.env.VITE_SUPABASE_URL?.includes('zsrkexpnfvivrtgzmgdw.supabase.co') &&
      !window.location.hostname.includes('staging') &&
      !window.location.hostname.includes('localhost')) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Open Debug Panel"
      >
        <Bug className="w-6 h-6" />
        {errorCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {errorCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className="fixed bg-gray-900 text-white shadow-2xl z-50 flex flex-col rounded-lg overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: '600px',
        height: '600px',
      }}
    >
      {/* Header - Draggable */}
      <div
        className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <Bug className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold">Partner Debug Panel</h3>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-red-900 text-red-200 rounded text-xs">
              {errorCount} errors
            </span>
            <span className="px-2 py-0.5 bg-blue-900 text-blue-200 rounded text-xs">
              {queryCount} queries
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User & Nonprofit Info */}
      <div className="p-3 bg-gray-800 border-b border-gray-700 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-green-400" />
          <span className="text-gray-400">User:</span>
          <span className="text-white">{user?.email || 'Not logged in'}</span>
          <span className="text-gray-500 text-xs">({user?.id?.slice(0, 8)}...)</span>
        </div>
        {nonprofitInfo && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400">Partner:</span>
            <span className="text-white">{nonprofitInfo.organization_name}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${
              nonprofitInfo.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
            }`}>
              {nonprofitInfo.status}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-2 bg-gray-800 border-b border-gray-700 flex flex-wrap gap-2">
        <button
          onClick={testLeadsQuery}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs flex items-center gap-1"
        >
          <Database className="w-3 h-3" />
          Test Leads Query
        </button>
        <button
          onClick={copyDebugInfo}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs flex items-center gap-1"
        >
          <Copy className="w-3 h-3" />
          Copy Info
        </button>
        <button
          onClick={clear}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs flex items-center gap-1 ml-auto"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Filters */}
      <div className="p-2 bg-gray-800 border-b border-gray-700 flex gap-2">
        {(['all', 'query', 'data', 'error'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Bug className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No debug entries</p>
            <p className="text-xs mt-1">Queries and errors will appear here</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div
              key={entry.id}
              className={`border rounded p-2 ${
                entry.type === 'error'
                  ? 'bg-red-900/20 border-red-700'
                  : entry.type === 'success' || entry.type === 'query'
                  ? 'bg-green-900/20 border-green-700'
                  : entry.type === 'warning'
                  ? 'bg-yellow-900/20 border-yellow-700'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div
                className="flex items-start gap-2 cursor-pointer"
                onClick={() => toggleEntry(entry.id)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {expandedEntries.has(entry.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-shrink-0">
                  {entry.type === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                  {entry.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  {(entry.type === 'success' || entry.type === 'query') && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {entry.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                  {entry.type === 'data' && <Database className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                      {entry.category}
                    </span>
                  </div>
                  <p className="text-sm break-words">{entry.message}</p>
                </div>
              </div>

              {expandedEntries.has(entry.id) && (entry.details || entry.stack) && (
                <div className="mt-2 ml-6 p-2 bg-black/40 rounded text-xs max-h-60 overflow-y-auto">
                  {entry.stack && (
                    <div className="mb-2">
                      <p className="text-gray-400 mb-1 font-semibold">Stack:</p>
                      <pre className="whitespace-pre-wrap text-red-300 text-xs">{entry.stack}</pre>
                    </div>
                  )}
                  {entry.details && (
                    <div>
                      <p className="text-gray-400 mb-1 font-semibold">Details:</p>
                      <pre className="whitespace-pre-wrap text-gray-300 text-xs">
                        {JSON.stringify(entry.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
