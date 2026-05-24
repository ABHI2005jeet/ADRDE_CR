import logoUrl from '../../assets/adrde-logo.svg';

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoUrl}
        alt="ADRDE logo"
        className={`${compact ? 'h-9 w-9' : 'h-12 w-12'} rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900`}
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-adrde-steel">ADRDE Agra</p>
        <p className={`font-semibold text-adrde-navy dark:text-slate-100 ${compact ? 'text-sm' : 'text-base'}`}>
          MAC Meeting Agenda
        </p>
      </div>
    </div>
  );
}
