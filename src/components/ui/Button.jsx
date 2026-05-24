import Icon from './Icon.jsx';

const variants = {
  primary:
    'bg-adrde-navy text-white hover:bg-adrde-blue focus:ring-adrde-blue/30 dark:bg-blue-500 dark:hover:bg-blue-400',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
  ghost:
    'text-slate-600 hover:bg-slate-100 focus:ring-slate-300 dark:text-slate-300 dark:hover:bg-slate-800',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30 dark:bg-red-500 dark:hover:bg-red-400',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/30 dark:bg-emerald-500 dark:hover:bg-emerald-400',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  icon: 'h-10 w-10 p-0',
};

export default function Button({
  children,
  className = '',
  icon,
  iconOnly = false,
  size = 'md',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold outline-none transition duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      title={iconOnly && typeof children === 'string' ? children : undefined}
      {...props}
    >
      {icon ? <Icon name={icon} className="h-4 w-4" /> : null}
      {iconOnly ? <span className="sr-only">{children}</span> : children}
    </button>
  );
}
