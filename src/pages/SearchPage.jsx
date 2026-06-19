import { useEffect, useState } from 'react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function SearchPage() {
  const { searchQuery, setSearchQuery, setActivePage, userApi } = useApp();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    userApi
      .search(searchQuery)
      .then((data) => setResults(data.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [searchQuery, userApi]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Search across users, meetings, documents, letters, inventory and activity."
        eyebrow="Search"
        title="Portal Search"
        actions={
          <input className="field w-full max-w-xs" type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search portal..." />
        }
      />
      {loading ? <p className="text-sm text-slate-500">Searching...</p> : null}
      {!searchQuery.trim() ? <p className="text-sm text-slate-500">Enter a keyword to search the portal.</p> : null}
      <div className="mt-4 space-y-3">
        {results.map((result) => (
          <article key={`${result.type}-${result.id}`} className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Badge tone="info">{result.type}</Badge>
                <p className="font-semibold">{result.label}</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.detail}</p>
            </div>
            <Button onClick={() => setActivePage(result.page)} size="sm" variant="secondary">Open</Button>
          </article>
        ))}
        {searchQuery.trim() && !loading && !results.length ? (
          <div className="surface p-6 text-sm text-slate-500">No results for &quot;{searchQuery}&quot;.</div>
        ) : null}
      </div>
    </div>
  );
}
