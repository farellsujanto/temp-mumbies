import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface DebugEntry {
  id: string;
  timestamp: string;
  type: 'query' | 'data' | 'error' | 'info' | 'success' | 'warning';
  category: string;
  message: string;
  details?: any;
  stack?: string;
}

interface DebugContextType {
  entries: DebugEntry[];
  logQuery: (name: string, query: any, results: any, error?: any) => void;
  logData: (label: string, data: any) => void;
  logError: (error: any, context?: string) => void;
  logInfo: (message: string, details?: any) => void;
  logSuccess: (message: string, details?: any) => void;
  clear: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<DebugEntry[]>([]);

  const addEntry = useCallback((entry: Omit<DebugEntry, 'id' | 'timestamp'>) => {
    const newEntry: DebugEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    setEntries(prev => [newEntry, ...prev].slice(0, 50));
  }, []);

  const logQuery = useCallback((name: string, query: any, results: any, error?: any) => {
    if (error) {
      addEntry({
        type: 'error',
        category: 'query',
        message: `Query "${name}" failed: ${error.message || error}`,
        details: { query, error, results },
        stack: error.stack,
      });
    } else {
      addEntry({
        type: 'success',
        category: 'query',
        message: `Query "${name}" returned ${Array.isArray(results) ? results.length : results ? 1 : 0} results`,
        details: { query, results },
      });
    }
  }, [addEntry]);

  const logData = useCallback((label: string, data: any) => {
    addEntry({
      type: 'data',
      category: 'data',
      message: label,
      details: data,
    });
  }, [addEntry]);

  const logError = useCallback((error: any, context?: string) => {
    addEntry({
      type: 'error',
      category: context || 'error',
      message: error.message || String(error),
      details: error,
      stack: error.stack,
    });
  }, [addEntry]);

  const logInfo = useCallback((message: string, details?: any) => {
    addEntry({
      type: 'info',
      category: 'info',
      message,
      details,
    });
  }, [addEntry]);

  const logSuccess = useCallback((message: string, details?: any) => {
    addEntry({
      type: 'success',
      category: 'success',
      message,
      details,
    });
  }, [addEntry]);

  const clear = useCallback(() => {
    setEntries([]);
  }, []);

  return (
    <DebugContext.Provider value={{ entries, logQuery, logData, logError, logInfo, logSuccess, clear }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within DebugProvider');
  }
  return context;
}
