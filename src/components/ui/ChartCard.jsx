export default function ChartCard({ children, title, subtitle }) {
  return (
    <section className="surface p-5">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
