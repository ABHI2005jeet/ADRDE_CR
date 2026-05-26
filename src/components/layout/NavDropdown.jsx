import { useEffect, useRef, useState } from 'react';

export default function NavDropdown({ active, items, label, onSelect, currentPage }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const childActive = items.some((item) => item.page === currentPage);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition duration-200 ${
          active || childActive
            ? 'bg-white/15 text-white'
            : 'text-slate-200 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {label}
        <span className="text-xs opacity-80">{open ? '▴' : '▾'}</span>
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[12rem] rounded-md border border-slate-200 bg-white py-1 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          {items.map((item) => (
            <button
              key={item.page}
              type="button"
              className={`block w-full px-4 py-2.5 text-left text-sm transition duration-200 ${
                currentPage === item.page
                  ? 'bg-adrde-mist font-semibold text-adrde-navy dark:bg-slate-800 dark:text-white'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              onClick={() => {
                onSelect(item.page);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
