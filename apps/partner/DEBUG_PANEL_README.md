# Partner Portal Debug Panel

A comprehensive debugging system for the Mumbies Partner Portal that provides real-time visibility into queries, data flows, and errors.

## Overview

The Debug Panel appears as a floating blue bug icon in the bottom-right corner of every page in the Partner Portal. It automatically captures:

- Database queries and their results
- Component data flows
- Errors and stack traces
- User and nonprofit information
- RLS policy issues

## Features

### Visual Debug Panel
- **Floating draggable window** - Position it anywhere on screen
- **Collapsible** - Minimizes to a small icon when not needed
- **Real-time logging** - See exactly what's happening as it happens
- **Color-coded entries** - Green (success), red (error), blue (info), purple (data)
- **Expandable details** - Click any entry to see full JSON data
- **Filter by type** - Show only queries, data, errors, or all

### Built-in Tests
- **Test Leads Query** - Instantly test if partner_leads query works
- **Copy Debug Info** - Copy all debug data to clipboard for sharing
- **Clear Logs** - Reset the debug panel

### Smart Environment Detection
Only appears on:
- `localhost` (local development)
- `staging` domains
- Never shows in production

## Installation

Already installed! The debug panel is integrated into:

1. `apps/partner/src/contexts/DebugContext.tsx` - Debug state management
2. `apps/partner/src/components/DebugPanel.tsx` - UI component
3. `apps/partner/src/App.tsx` - App-wide integration
4. `apps/partner/src/components/partner/LeadsTab.tsx` - Example usage

## Usage

### Using the Debug Panel

1. **Open the panel**: Click the blue bug icon in bottom-right
2. **View logs**: See all queries and data in real-time
3. **Expand entries**: Click any log to see full details
4. **Test queries**: Click "Test Leads Query" to manually test
5. **Copy data**: Click "Copy Info" to share debug data
6. **Filter**: Toggle between All/Query/Data/Error views
7. **Drag**: Click and drag the header to reposition
8. **Close**: Click X to minimize back to icon

### Adding Debug Logging to Components

```typescript
import { useDebug } from '../contexts/DebugContext';

function MyComponent() {
  const { logQuery, logData, logError } = useDebug();

  // Log a database query
  const fetchData = async () => {
    const query = supabase.from('table').select('*');
    const { data, error } = await query;

    logQuery('myQuery', { /* query params */}, data, error);
  };

  // Log arbitrary data
  logData('Component mounted', { prop1, prop2 });

  // Log errors
  try {
    // something
  } catch (err) {
    logError(err, 'myFunction');
  }
}
```

### Available Debug Methods

#### `logQuery(name, query, results, error?)`
Logs a database query and its results.
- **name**: Descriptive name (e.g., "partner_leads.fetchAll")
- **query**: Query parameters or object
- **results**: Data returned from query
- **error**: Optional error object

#### `logData(label, data)`
Logs arbitrary data for inspection.
- **label**: Description of the data
- **data**: Any object or value to log

#### `logError(error, context?)`
Logs an error with optional context.
- **error**: Error object or message
- **context**: Where the error occurred

#### `logInfo(message, details?)`
Logs informational messages.
- **message**: Info message
- **details**: Optional additional data

#### `logSuccess(message, details?)`
Logs success messages.
- **message**: Success message
- **details**: Optional additional data

#### `clear()`
Clears all debug entries.

## What You'll See

### User Information
```
User: partner@example.com (abc12345...)
Partner: Wisconsin Humane Society [active]
```

### Query Logs
```
✓ Query "partner_leads.fetchAll" returned 26 results
  12:34:56 PM | query
  Details:
  {
    "partnerId": "...",
    "results": [...]
  }
```

### Error Logs
```
✗ Query "partner_leads" failed: permission denied
  12:34:56 PM | error
  Stack: Error: permission denied
    at supabase.from...
  Details: {...}
```

### Data Logs
```
📊 Leads categorized
  12:34:56 PM | data
  {
    "all": 26,
    "expiring": 5,
    "gifted": 12
  }
```

## Debugging Common Issues

### "Partner portal shows 0 leads"

1. Open Debug Panel
2. Click "Test Leads Query"
3. Check the log:
   - ✓ Green = Query succeeded, check if `results.length > 0`
   - ✗ Red = Query failed, check error message
   - If `results.length === 0` but admin shows leads, check `partnerId`

### "RLS policy blocking access"

Look for error messages containing:
- `permission denied`
- `row-level security`
- `violates row-level security policy`

Check if `status` field is being selected in query.

### "Query returns undefined"

1. Check the expanded query details
2. Verify field names match database schema
3. Check if `.maybeSingle()` or `.single()` is used correctly

### "TypeScript errors"

Debug panel won't show TS errors, but will show runtime errors. Check browser console for TS issues.

## Real-World Example: Debugging Leads Issue

**Problem**: Partner sees 0 leads but admin sees 26

**Debug Process**:
1. Open Debug Panel on partner portal
2. Navigate to Leads page
3. See log: `Query "partner_leads.fetchAll" returned 0 results`
4. Expand the log, see:
   ```json
   {
     "partnerId": "abc-123",
     "results": []
   }
   ```
5. Click "Test Leads Query"
6. See error: `Error: column "status" does not exist`
7. **Solution**: Add `status` to SELECT query

## Pro Tips

### Keep It Open During Development
The panel remembers the last 50 entries, so you can:
1. Open panel
2. Minimize it
3. Navigate around the app
4. Reopen to see all queries that happened

### Use Filters
- Switch to "Error" filter to see only problems
- Switch to "Query" filter to see only database calls
- Switch to "Data" filter to see component data flows

### Copy Debug Info
The "Copy Info" button creates a complete debug report:
```json
{
  "user": { "id": "...", "email": "..." },
  "nonprofit": { "id": "...", "name": "...", "status": "..." },
  "entries": [...last 10 entries...],
  "timestamp": "2025-11-04T12:34:56Z"
}
```

Perfect for sharing with developers or support.

### Test Before Implementing
Before writing new queries, use "Test Leads Query" as a template to verify:
- RLS policies allow access
- Data exists in database
- Field names are correct
- Query syntax is valid

## Customization

### Change Position
Drag the panel by its header to any position. It will stay where you put it.

### Add More Test Buttons
Edit `DebugPanel.tsx` to add custom test queries:

```typescript
const testMyQuery = async () => {
  logInfo('Testing my custom query...');
  const { data, error } = await supabase
    .from('my_table')
    .select('*');
  logQuery('my_custom_test', {}, data, error);
};

// Add button in Controls section
<button onClick={testMyQuery}>Test My Query</button>
```

### Change Colors/Styling
All styling uses Tailwind classes. Edit the className strings in `DebugPanel.tsx`.

## Troubleshooting

### "Debug panel not showing"
- Check if you're on `localhost` or a `staging` domain
- Production environments hide the debug panel
- Check browser console for React errors

### "useDebug is not defined"
- Ensure component is wrapped in `<DebugProvider>`
- Check that `DebugProvider` is in `App.tsx`
- Verify import: `import { useDebug } from '../contexts/DebugContext'`

### "Logs not appearing"
- Open browser console, check for errors
- Verify debug calls are actually being executed
- Try `console.log()` first to ensure code is running

### "Panel won't drag"
- Click specifically on the header bar (dark gray area)
- Don't click on buttons in the header
- Try refreshing the page

## Architecture

```
App.tsx
  └─ DebugProvider (context)
      ├─ All Pages
      │   └─ Components
      │       └─ useDebug() hooks
      └─ DebugPanel (floating UI)
```

**Flow**:
1. Components call `logQuery()`, `logData()`, etc.
2. DebugContext stores entries in state
3. DebugPanel reads entries and displays them
4. User can interact with panel to inspect data

## Performance

- Stores max 50 entries (prevents memory issues)
- Logs are in-memory only (cleared on page refresh)
- Panel UI only renders when open (minimal performance impact)
- Console.log still works normally (debug panel doesn't interfere)

## Security

- Only visible in non-production environments
- No sensitive data is sent to external services
- All data stays in browser memory
- "Copy Info" only copies to clipboard (user controls sharing)

## Future Enhancements

Potential improvements:
- Export logs to file
- Search/filter by text
- Network request logging
- Performance metrics
- Persistent logs across page loads
- Dark/light theme toggle
- Keyboard shortcuts

## Support

If you encounter issues:
1. Check browser console for errors
2. Use "Copy Info" to capture debug data
3. Share the copied JSON with the development team
4. Include: browser version, steps to reproduce, expected vs actual behavior
