import React, { useEffect, useMemo, useState } from 'react';
import { getJSON, postJSON } from '../api';
import { FaTint, FaLeaf, FaBug, FaTractor, FaEllipsisH, FaCheckCircle, FaSearch, FaSyncAlt } from 'react-icons/fa';

/* icon mapping (kept from your original) */
const iconsMap = {
  irrigation: <FaTint className="text-green-600" />,
  fertilization: <FaLeaf className="text-emerald-600" />,
  pesticide_application: <FaBug className="text-red-500" />,
  harvesting: <FaTractor className="text-yellow-600" />,
  other: <FaEllipsisH className="text-gray-600" />,
};

export default function ActivityDashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [lastAiAt, setLastAiAt] = useState(null);

  useEffect(() => {
    setLoading(true);
    getJSON('/activity/list')
      .then(res => {
        setActivities(res.data || []);
      })
      .catch(err => {
        console.error('Failed to load activities', err);
        setError('Failed to load activities');
      })
      .finally(() => setLoading(false));
  }, []);

  // derived lists
  const activityTypes = useMemo(() => {
    const s = new Set();
    activities.forEach(a => {
      if (a.type) s.add(a.type);
    });
    return Array.from(s);
  }, [activities]);

  // top activity types (by frequency) -> for AI
  const topActivityTypes = useMemo(() => {
    const freq = {};
    activities.forEach(a => {
      const k = a.type || 'other';
      freq[k] = (freq[k] || 0) + 1;
    });
    const arr = Object.keys(freq).map(k => ({ type: k, count: freq[k] }));
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 10);
  }, [activities]);

  // filtered activities for display
  const displayed = useMemo(() => {
    return activities
      .filter(a => (filterType === 'all' ? true : a.type === filterType))
      .filter(a => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (a.note || '').toLowerCase().includes(q) || (a.type || '').toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [activities, filterType, query]);

  // helper: pretty date
  const prettyDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  // helper: truncate long notes to avoid huge payloads
  const truncate = (str, n = 300) => {
    if (!str) return '';
    return str.length > n ? str.slice(0, n) + '…' : str;
  };

  /**
   * Generate AI suggestions
   * Payload now includes:
   * - topActivities: [{type, count}, ...]
   * - recentActivities: up to 20 most recent {type, note, timestamp}
   * - allActivities: up to 200 activities with {type, note, timestamp} (for broader context)
   *
   * AI can use notes+type to provide more accurate, contextual suggestions.
   */
  const generateAiSuggestions = async () => {
    setAiLoading(true);
    setSuggestions([]);
    setLastAiAt(null);

    const recentActivities = activities
      .slice() // copy
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20)
      .map(a => ({
        type: a.type || 'other',
        note: truncate(a.note || '', 500),
        timestamp: a.timestamp || a._id || null
      }));

    const allActivities = activities.slice(0, 200).map(a => ({
      type: a.type || 'other',
      note: truncate(a.note || '', 300),
      timestamp: a.timestamp || a._id || null
    }));

    const payload = {
      topActivities: topActivityTypes,    // [{type, count}, ...]
      recentActivities,                   // most recent 20 (full notes)
      allActivities,                      // up to 200 for broader pattern detection
      // optional: you can add context like location/crop if available in your app
      // context: { location: 'Jhansi', crop: 'paddy' }
    };

    try {
      // call backend AI endpoint (implement server side to call LLM or rules engine)
      const res = await postJSON('/ai/activity-suggestions', payload);
      if (res && res.suggestions) {
        setSuggestions(res.suggestions);
        setLastAiAt(new Date().toISOString());
      } else {
        setSuggestions([{ title: 'No suggestions', detail: 'AI returned empty response.' }]);
      }
    } catch (e) {
      console.error('AI suggestion error', e);
      setSuggestions([{ title: 'Error', detail: 'Failed to generate suggestions. Try again later.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Activities (2/3 width on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Activity Dashboard</h2>
                <p className="text-sm text-gray-500">Recent field operations and logs</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{activities.length}</div>
                  <div className="text-xs text-gray-500">Total activities</div>
                </div>
                <button
                  onClick={() => { setLoading(true); getJSON('/activity/list').then(r => setActivities(r.data || [])).finally(()=>setLoading(false)); }}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm hover:shadow"
                  title="Refresh"
                >
                  <FaSyncAlt />
                </button>
              </div>
            </div>

            {/* controls */}
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4 gap-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by note or type..."
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />
                  <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="w-48">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
                >
                  <option value="all">All types</option>
                  {activityTypes.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* timeline */}
            <div className="mt-5 divide-y">
              {loading ? (
                <div className="py-6 text-center text-gray-500">Loading activities...</div>
              ) : displayed.length ? displayed.map((act) => (
                <div key={act._id || (act.timestamp + act.type)} className="py-4 flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border rounded-lg">
                    <div className="text-2xl">{iconsMap[act.type] || <FaCheckCircle className="text-gray-600" />}</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-800 capitalize">{act.type || 'other'}</div>
                      <div className="text-xs text-gray-400">{prettyDate(act.timestamp)}</div>
                    </div>
                    {act.note && <div className="mt-2 text-gray-700 text-sm">{act.note}</div>}
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="inline-block text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">{act.field || 'Field: N/A'}</span>
                      <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">Logged by: {act.user || '—'}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-6 text-center text-gray-500">No activities recorded.</div>
              )}
            </div>
          </div>

          {/* small stats / top activities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-500">Unique Types</div>
              <div className="text-lg font-semibold">{activityTypes.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-500">Top Activity</div>
              <div className="text-lg font-semibold">{topActivityTypes[0]?.type || '—'}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-500">Most Recent</div>
              <div className="text-lg font-semibold">{activities[0] ? prettyDate(activities[0].timestamp) : '—'}</div>
            </div>
          </div>
        </div>

        {/* Right column: AI suggestions & quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-md font-semibold text-gray-900">AI — Suggestions</h3>
            <p className="text-sm text-gray-500 mb-3">Get recommended actions based on recent/top activities (powered by AI).</p>

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <div className="font-medium">Top activity types</div>
                <ol className="list-decimal ml-5 mt-2 text-sm">
                  {topActivityTypes.map((t, i) => <li key={t.type}>{t.type} — {t.count}</li>)}
                </ol>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generateAiSuggestions}
                  disabled={aiLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  {aiLoading ? 'Generating...' : 'Generate Suggestions'}
                </button>
                <button
                  onClick={() => { setSuggestions([]); setLastAiAt(null); }}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold text-gray-900">Suggestions</h4>
            <p className="text-xs text-gray-500 mb-2">AI recommendations based on your top activities.</p>

            <div className="space-y-3">
              {aiLoading && <div className="text-sm text-gray-500">AI is thinking…</div>}

              {!aiLoading && suggestions.length === 0 && (
                <div className="text-sm text-gray-400">No suggestions yet. Click "Generate Suggestions".</div>
              )}

              {suggestions.map((s, i) => (
                <div key={i} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-800">{s.title || `Suggestion ${i+1}`}</div>
                    {s.confidence && <div className="text-xs text-gray-500">{Math.round(s.confidence*100)}%</div>}
                  </div>
                  {s.detail && <div className="mt-2 text-sm text-gray-700">{s.detail}</div>}
                </div>
              ))}

              {lastAiAt && <div className="text-xs text-gray-400 mt-2">Last generated: {prettyDate(lastAiAt)}</div>}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-600">
            <div className="font-semibold mb-2">How AI works (suggested)</div>
            <ul className="list-disc ml-5">
              <li>AI uses top activities and recent notes to propose actions (timing, doses, checks).</li>
              <li>It can also flag anomalies (sudden pest spike) and suggest inspections.</li>
              <li>Suggestions are advisory — always confirm locally before applying.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
