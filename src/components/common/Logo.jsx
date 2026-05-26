import adrdeLogo from '../../assets/adrde-logo.png';
import drdoLogo from '../../assets/drdo-logo.svg';

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={drdoLogo}
        alt="DRDO logo placeholder"
        className={`${compact ? 'h-9 w-9' : 'h-10 w-10'} rounded-md border border-slate-200 bg-white p-0.5 dark:border-slate-700`}
      />
      <img
        src={adrdeLogo}
        alt="ADRDE logo"
        className={`${compact ? 'h-9 w-9' : 'h-10 w-10'} rounded-full border border-slate-200 bg-white object-cover dark:border-slate-700`}
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-adrde-steel">ADRDE Agra · DRDO</p>
        <p className={`font-semibold text-adrde-navy dark:text-slate-100 ${compact ? 'text-sm' : 'text-base'}`}>
          Dashboard Portal
        </p>
      </div>
    </div>
  );
}
