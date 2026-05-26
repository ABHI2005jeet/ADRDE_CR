import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { runPortalSearch } from '../utils/portalSearch.js';

export default function SearchPage() {
  const {
    activities,
    agendas,
    documents,
    inventory,
    letters,
    meetings,
    notifications,
    searchQuery,
    setActivePage,
    setSearchQuery,
  } = useApp();

  const results = runPortalSearch(searchQuery, {
    meetings,
    agendas,
    documents,
    letters,
    inventory,
    notifications,
    activities,
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Results across meetings, documents, letters, inventory, and more."
        eyebrow="Search"
        title="Portal Search"
        actions={
          <input
            className="field w-full max-w-xs"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search portal..."
            type="search"
            value={searchQuery}
          />
        }
      />

      {!searchQuery.trim() ? (
        <p className="text-sm text-slate-500">Enter a term in the search bar above to find records.</p>
      ) : null}

      {searchQuery.trim() && !results.length ? (
        <div className="surface p-6 text-sm text-slate-600 dark:text-slate-300">
          No results for &quot;{searchQuery}&quot;. Try another keyword.
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {results.map((result) => (
          <article
            key={result.id}
            className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge tone="info">{result.type}</Badge>
                <p className="font-semibold text-slate-950 dark:text-white">{result.label}</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{result.detail}</p>
            </div>
            <Button onClick={() => setActivePage(result.page)} size="sm" variant="secondary">
              Open
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
