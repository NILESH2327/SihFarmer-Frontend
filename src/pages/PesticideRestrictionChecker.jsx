/*
PesticideRestrictionChecker.jsx
Single-file React component (default export). Tailwind CSS utility classes assumed.
Usage: import and render <PesticideRestrictionChecker /> inside your Tools page.
It uses the SAME background image as your MarketTrends page. By default it points to '/farm-bg.jpg' — change `bgUrl` if your project uses a different path.

Notes:
- This component ships with a small mock dataset (replace with real Kerala govt data / API).
- File upload "scan" is accepted but not OCRed in this file — replace `handleImageScan` with an OCR/image-classification API call.
- For production, replace `PEST_DB` with a server endpoint and call it via fetch/axios.
*/

import React, { useState, useMemo } from 'react';
import { Search, UploadCloud, X, CheckCircle, AlertCircle } from 'lucide-react';

const bgUrl = '/farm-bg.jpg'; // <-- use same bg as MarketTrends. Change if your path differs.

// Mock pesticide DB. Replace with authoritative Kerala govt list or a backend API.
const PEST_DB = [
  { name: 'Monocrotophos', status: 'Banned', alternatives: ['Neem oil', 'Emamectin benzoate (where allowed)', 'Integrated pest management'] },
  { name: 'Chlorpyrifos', status: 'Restricted', alternatives: ['Spinosad', 'Bt formulations', 'Neem-based products'] },
  { name: 'Imidacloprid', status: 'Restricted', alternatives: ['Fipronil alternatives where allowed', 'Cultural control'] },
  { name: 'Cypermethrin', status: 'Allowed', alternatives: ['Low-toxicity pyrethroids with guidance'] },
  { name: 'Lambda-cyhalothrin', status: 'Allowed', alternatives: ['Use as per label'] },
  { name: 'Glyphosate', status: 'Restricted', alternatives: ['Manual weeding', 'Mulching'] },
];

export default function PesticideRestrictionChecker() {
  const [query, setQuery] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return PEST_DB.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  function lookupPesticide(name) {
    if (!name) return null;
    const found = PEST_DB.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (found) return found;
    // fallback: fuzzy search by includes
    const fuzzy = PEST_DB.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
    return fuzzy || { name, status: 'Unknown', alternatives: ['Contact local agriculture office or KAU for exact status'] };
  }

  function handleSearch(e) {
    e.preventDefault();
    const r = lookupPesticide(query.trim());
    setResult(r);
  }

  function handleSelectSuggestion(name) {
    setQuery(name);
    setResult(lookupPesticide(name));
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    // Placeholder: in production, call OCR or image-classifier endpoint here.
    // Example: send file to /api/scan-pesticide which returns detected name.
    // For demo, we'll pretend the filename contains a pesticide name.
    const guessed = PEST_DB.find(p => f.name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]));
    setResult(guessed || { name: f.name, status: 'Unknown', alternatives: ['Upload clearer image or type the name'] });
  }

  function StatusBadge({ status }) {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === 'banned') return <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 text-red-300 text-sm"><AlertCircle size={16}/> BANNED</span>;
    if (s === 'restricted') return <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900/50 text-yellow-300 text-sm"><AlertCircle size={16}/> RESTRICTED</span>;
    if (s === 'allowed') return <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/50 text-green-300 text-sm"><CheckCircle size={16}/> ALLOWED</span>;
    return <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 text-slate-200 text-sm">{status.toUpperCase()}</span>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="backdrop-brightness-50 bg-[rgba(2,48,33,0.62)] min-h-screen p-8">
        <div className="max-w-6xl mx-auto text-center text-white py-12">
          <h1 className="text-3xl font-extrabold">Pesticide Restriction Checker</h1>
          <p className="mt-2 text-slate-200 max-w-2xl mx-auto">Scan or type a pesticide name to check whether it's allowed, restricted, or banned in Kerala — and get safer alternatives.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <form onSubmit={handleSearch} className="md:col-span-2 bg-[#072d23]/60 p-6 rounded-2xl shadow-lg">
            <label className="block text-sm text-slate-200 mb-2">Search pesticide</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setResult(null); }}
                  placeholder="Type pesticide name (e.g. Monocrotophos)"
                  className="w-full rounded-lg px-4 py-3 bg-[#062b22]/40 border border-slate-700 placeholder-slate-300 text-white"
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-md flex items-center gap-2">
                  <Search size={16} /> <span className="text-sm">Check</span>
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg bg-[#062b22]/40 border border-slate-700">
                <UploadCloud size={18} />
                <input onChange={handleFileChange} type="file" accept="image/*" className="hidden" />
                <span className="text-sm text-slate-200">Scan image</span>
              </label>
            </div>

            {suggestions.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {suggestions.map(s => (
                  <button key={s.name} type="button" onClick={() => handleSelectSuggestion(s.name)} className="text-left px-3 py-2 bg-slate-800/30 rounded-md text-slate-200 hover:bg-slate-800/50">
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 text-sm text-slate-300">
              <p>Tip: Use clear label photos for scanning. For authoritative, up-to-date lists, connect this component to a Kerala government pesticide registry API or upload an official CSV to your server.</p>
            </div>
          </form>

          <div className="bg-[#072d23]/60 p-6 rounded-2xl shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Result</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { setResult(null); setQuery(''); setFileName(''); }} className="px-3 py-2 rounded bg-slate-800/40 text-sm text-slate-200">Clear</button>
                <button onClick={() => setShowAll(s => !s)} className="px-3 py-2 rounded bg-slate-800/40 text-sm text-slate-200">{showAll ? 'Hide list' : 'Show list'}</button>
              </div>
            </div>

            <div className="flex-1">
              {!result && (
                <div className="text-slate-300">No result yet. Type or scan a pesticide to get status information.</div>
              )}

              {result && (
                <div className="mt-2 bg-[#062e27]/40 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold">{result.name}</h4>
                        <StatusBadge status={result.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-300">Status reflects a local dataset. Replace with official Kerala govt data for production.</p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      {fileName && <div className="mb-1">Scanned file: <span className="text-slate-200">{fileName}</span></div>}
                      <div>Last checked: <span className="text-slate-200">{new Date().toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-semibold text-slate-200">Safer alternatives</h5>
                    <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {result.alternatives?.map((alt, i) => (
                        <li key={i} className="text-sm text-slate-300 bg-slate-800/20 px-3 py-2 rounded">{alt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a target="_blank" rel="noreferrer" href="#" className="text-sm px-3 py-2 rounded bg-emerald-700/80">Kerala Govt details</a>
                    <a href="#" className="text-sm px-3 py-2 rounded bg-slate-800/40">Get local advice</a>
                  </div>
                </div>
              )}

              {showAll && (
                <div className="mt-4">
                  <h5 className="text-slate-200 font-semibold mb-2">Sample dataset</h5>
                  <ul className="space-y-2 max-h-48 overflow-auto">
                    {PEST_DB.map(p => (
                      <li key={p.name} className="flex items-center justify-between bg-slate-800/20 px-3 py-2 rounded">
                        <div className="text-sm text-slate-200">{p.name}</div>
                        <div className="text-sm text-slate-300">{p.status}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400">Built for Kerala farmers — connect this component to your backend to keep the list synced with official notifications (KAU, KSDMA, Dept. of Agriculture).</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 text-center text-slate-300 text-sm">
          <p>Want Malayalam labels, voice input, or a CSV import tool to load official lists? I can add them next.</p>
        </div>
      </div>
    </div>
  );
}
