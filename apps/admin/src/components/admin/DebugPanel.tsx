import { useState, useEffect } from 'react';
import { supabase } from '@mumbies/shared';
import { Bug, X, ChevronDown, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DebugLog {
  id: string;
  timestamp: string;
  type: 'info' | 'error' | 'success' | 'warning';
  category: string;
  message: string;
  details?: any;
  stack?: string;
}

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'success'>('all');

  useEffect(() => {
    // Override console methods to capture logs
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    console.error = (...args) => {
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog('error', 'console', message, args);
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog('warning', 'console', message, args);
      originalWarn.apply(console, args);
    };

    console.log = (...args) => {
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      if (message.includes('Error') || message.includes('error')) {
        addLog('error', 'console', message, args);
      } else {
        addLog('info', 'console', message, args);
      }
      originalLog.apply(console, args);
    };

    // Catch unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addLog('error', 'unhandled-promise', event.reason?.message || 'Unhandled promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const addLog = (type: DebugLog['type'], category: string, message: string, details?: any) => {
    const log: DebugLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      type,
      category,
      message,
      details,
      stack: details instanceof Error ? details.stack : undefined
    };

    setLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const toggleLog = (id: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearLogs = () => {
    setLogs([]);
    setExpandedLogs(new Set());
  };

  const testDatabaseConnection = async () => {
    addLog('info', 'test', 'Testing database connection...', null);

    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);

      if (error) {
        addLog('error', 'database', `Database connection failed: ${error.message}`, error);
      } else {
        addLog('success', 'database', 'Database connection successful', data);
      }
    } catch (err: any) {
      addLog('error', 'database', `Database test failed: ${err.message}`, err);
    }
  };

  const testBalanceHealthFunction = async () => {
    addLog('info', 'test', 'Testing admin_get_balance_health function...', null);

    try {
      const { data, error } = await supabase.rpc('admin_get_balance_health');

      if (error) {
        addLog('error', 'function', `admin_get_balance_health failed: ${error.message}`, error);
      } else {
        addLog('success', 'function', 'admin_get_balance_health successful', data);
      }
    } catch (err: any) {
      addLog('error', 'function', `Function test failed: ${err.message}`, err);
    }
  };

  const testPartnerDetails = async () => {
    addLog('info', 'test', 'Testing partner details fetch...', null);

    try {
      // Get first partner
      const { data: partners, error: partnersError } = await supabase
        .from('nonprofits')
        .select('id, organization_name')
        .limit(1)
        .maybeSingle();

      if (partnersError) {
        addLog('error', 'query', `Failed to fetch partners: ${partnersError.message}`, partnersError);
        return;
      }

      if (!partners) {
        addLog('warning', 'query', 'No partners found in database', null);
        return;
      }

      addLog('success', 'query', `Found partner: ${partners.organization_name}`, partners);

      // Test partner detail function
      const { data: details, error: detailsError } = await supabase
        .rpc('admin_get_partner_details', { p_partner_id: partners.id });

      if (detailsError) {
        addLog('error', 'function', `admin_get_partner_details failed: ${detailsError.message}`, detailsError);
      } else {
        addLog('success', 'function', 'admin_get_partner_details successful', details);
      }
    } catch (err: any) {
      addLog('error', 'test', `Partner details test failed: ${err.message}`, err);
    }
  };

  const testGiveaways = async () => {
    addLog('info', 'test', 'Testing giveaways fetch...', null);

    try {
      const { data, error } = await supabase
        .from('partner_giveaways')
        .select(`
          *,
          bundle:bundle_id (
            name,
            retail_value,
            tier
          )
        `)
        .limit(5);

      if (error) {
        addLog('error', 'query', `Giveaways fetch failed: ${error.message}`, error);
      } else {
        addLog('success', 'query', `Found ${data?.length || 0} giveaways`, data);
      }
    } catch (err: any) {
      addLog('error', 'test', `Giveaways test failed: ${err.message}`, err);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warningCount = logs.filter(l => l.type === 'warning').length;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
        title="Open Debug Panel"
      >
        <Bug className="w-6 h-6" />
        {(errorCount > 0 || warningCount > 0) && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {errorCount + warningCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-2/3 lg:w-1/2 h-2/3 bg-gray-900 text-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Bug className="w-5 h-5" />
          <h3 className="font-semibold">Debug Panel</h3>
          <div className="flex gap-2 ml-4">
            <span className="px-2 py-1 bg-red-900 text-red-200 rounded text-xs">
              {errorCount} errors
            </span>
            <span className="px-2 py-1 bg-yellow-900 text-yellow-200 rounded text-xs">
              {warningCount} warnings
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

      {/* Controls */}
      <div className="p-3 bg-gray-800 border-b border-gray-700 flex flex-wrap gap-2">
        <button
          onClick={testDatabaseConnection}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Test DB Connection
        </button>
        <button
          onClick={testBalanceHealthFunction}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Test Balance Health
        </button>
        <button
          onClick={testPartnerDetails}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Test Partner Details
        </button>
        <button
          onClick={testGiveaways}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Test Giveaways
        </button>
        <button
          onClick={clearLogs}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm ml-auto"
        >
          Clear Logs
        </button>
      </div>

      {/* Filters */}
      <div className="p-2 bg-gray-800 border-b border-gray-700 flex gap-2">
        {(['all', 'error', 'warning', 'success'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f
                ? 'bg-gray-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredLogs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No logs to display</p>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className={`border rounded p-2 ${
                log.type === 'error'
                  ? 'bg-red-900/20 border-red-700'
                  : log.type === 'warning'
                  ? 'bg-yellow-900/20 border-yellow-700'
                  : log.type === 'success'
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div
                className="flex items-start gap-2 cursor-pointer"
                onClick={() => toggleLog(log.id)}
              >
                <div className="flex-shrink-0 mt-1">
                  {expandedLogs.has(log.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-shrink-0">
                  {log.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                  {log.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                  {log.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {log.type === 'info' && <Bug className="w-5 h-5 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-sm break-words">{log.message}</p>
                </div>
              </div>

              {expandedLogs.has(log.id) && (log.details || log.stack) && (
                <div className="mt-2 ml-7 p-2 bg-black/30 rounded text-xs">
                  {log.stack && (
                    <div className="mb-2">
                      <p className="text-gray-400 mb-1">Stack Trace:</p>
                      <pre className="whitespace-pre-wrap text-red-300">{log.stack}</pre>
                    </div>
                  )}
                  {log.details && (
                    <div>
                      <p className="text-gray-400 mb-1">Details:</p>
                      <pre className="whitespace-pre-wrap text-gray-300">
                        {JSON.stringify(log.details, null, 2)}
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
