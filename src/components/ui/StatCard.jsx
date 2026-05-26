import Icon from './Icon.jsx';

const toneStyles = {
  navy: 'bg-adrde-navy/10 text-adrde-navy dark:bg-blue-500/15 dark:text-blue-200',
  blue: 'bg-adrde-blue/10 text-adrde-blue dark:bg-blue-400/15 dark:text-blue-200',
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  amber: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
};

/** Dashboard metric card with optional icon and tone */
export default function StatCard({ label, value, helper, hint, icon, onClick, tone = 'navy' }) {
  const description = helper || hint;
  const Tag = onClick ? 'button' : 'article';

  return (
    <Tag
      className={`surface animate-slide-up w-full p-5 text-left transition duration-200 ${
        onClick ? 'hover:border-adrde-blue/40 hover:shadow-md' : ''
      }`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-adrde-navy dark:text-slate-100">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-md ${toneStyles[tone] || toneStyles.navy}`}
          >
            <Icon name={icon} className="h-5 w-5" />
          </div>
        )}
      </div>
    </Tag>
  );
}
