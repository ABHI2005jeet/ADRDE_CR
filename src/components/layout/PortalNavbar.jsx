import { useState } from 'react';
import adrdeLogo from '../../assets/adrde-logo.png';
import drdoLogo from '../../assets/drdo-logo.svg';
import { getNavSection, portalNavigation } from '../../config/navigation.js';
import { useApp } from '../../context/AppContext.jsx';
import Button from '../ui/Button.jsx';
import NavDropdown from './NavDropdown.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';

export default function PortalNavbar() {
  const { activePage, searchQuery, setActivePage, setSearchQuery, runSearch, theme, toggleTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = getNavSection(activePage);

  const navigate = (page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    runSearch();
    setMobileOpen(false);
  };

  const searchField = (
    <input
      className="w-48 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white placeholder:text-slate-300 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 lg:w-56"
      onChange={(event) => setSearchQuery(event.target.value)}
      placeholder="Search portal..."
      type="search"
      value={searchQuery}
    />
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-adrde-navy shadow-md dark:border-slate-800">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              className="border-white/20 text-white hover:bg-white/10 lg:hidden"
              icon="menu"
              iconOnly
              onClick={() => setMobileOpen((value) => !value)}
              size="icon"
              variant="ghost"
            >
              Open menu
            </Button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md transition duration-200 hover:opacity-90"
              onClick={() => navigate('dashboard')}
            >
              <img
                src={drdoLogo}
                alt="DRDO logo placeholder"
                className="h-10 w-10 rounded-md border border-white/20 bg-white p-0.5"
              />
              <img
                src={adrdeLogo}
                alt="ADRDE logo"
                className="h-10 w-10 rounded-full border border-white/20 bg-white object-cover"
              />
            </button>
            <button type="button" className="min-w-0 text-left" onClick={() => navigate('dashboard')}>
              <p className="truncate text-sm font-bold text-white sm:text-base">ADRDE Agra Dashboard Portal</p>
              <p className="hidden truncate text-xs text-slate-300 sm:block">DRDO · Internal R&amp;D workspace</p>
            </button>
          </div>

          <form className="hidden items-center gap-2 md:flex" onSubmit={handleSearchSubmit}>
            {searchField}
            <Button className="border-white/20 text-white hover:bg-white/10" size="sm" type="submit" variant="ghost">
              Search
            </Button>
          </form>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              className="border-white/20 text-white hover:bg-white/10"
              icon={theme === 'dark' ? 'sun' : 'moon'}
              onClick={toggleTheme}
              size="sm"
              variant="ghost"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <ProfileDropdown />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              className="border-white/20 text-white hover:bg-white/10"
              icon={theme === 'dark' ? 'sun' : 'moon'}
              iconOnly
              onClick={toggleTheme}
              size="icon"
              variant="ghost"
            >
              Toggle theme
            </Button>
            <ProfileDropdown />
          </div>
        </div>
      </div>

      <nav className="hidden border-t border-white/10 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-1 sm:px-6 lg:px-8">
          {portalNavigation.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.id}
                active={activeSection === item.id}
                currentPage={activePage}
                items={item.children}
                label={item.label}
                onSelect={navigate}
              />
            ) : (
              <button
                key={item.id}
                type="button"
                className={`rounded-md px-3 py-2 text-sm font-semibold transition duration-200 ${
                  activePage === item.page
                    ? 'bg-white/15 text-white'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => navigate(item.page)}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      </nav>

      <div
        className={`border-t border-white/10 bg-adrde-blue transition-all duration-200 lg:hidden ${
          mobileOpen ? 'max-h-[36rem] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className="space-y-2 px-4 py-4">
          <form className="flex gap-2" onSubmit={handleSearchSubmit}>
            <input
              className="field flex-1 border-white/20 bg-white/10 text-white placeholder:text-slate-300"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search portal..."
              type="search"
              value={searchQuery}
            />
            <Button className="shrink-0 border-white/20 text-white" size="sm" type="submit" variant="ghost">
              Go
            </Button>
          </form>
          {portalNavigation.map((item) =>
            item.children ? (
              <div key={item.id} className="rounded-md border border-white/10 p-2">
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">{item.label}</p>
                <div className="mt-1 space-y-1">
                  {item.children.map((child) => (
                    <button
                      key={child.page}
                      type="button"
                      className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                        activePage === child.page ? 'bg-white/15 text-white' : 'text-slate-200 hover:bg-white/10'
                      }`}
                      onClick={() => navigate(child.page)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={item.id}
                type="button"
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-200 hover:bg-white/10"
                onClick={() => navigate(item.page)}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      </div>
    </header>
  );
}
