import Badge from '../components/ui/Badge.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const steps = [
  { label: 'Meeting Created', status: 'Completed', detail: 'Schedule and venue confirmed' },
  { label: 'Agenda Uploaded', status: 'Completed', detail: 'Department agenda items attached' },
  { label: 'Approval', status: 'In Progress', detail: 'Para Head review pending for selected items' },
  { label: 'Meeting Conducted', status: 'Upcoming', detail: 'Minutes and attendance to be captured' },
  { label: 'Report Generated', status: 'Upcoming', detail: 'Final report available after closure' },
];

const tones = {
  Completed: 'success',
  'In Progress': 'warning',
  Upcoming: 'neutral',
};

export default function TimelinePage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Visual workflow status from meeting creation through final report generation."
        eyebrow="Lifecycle"
        title="Meeting Timeline"
      />

      <section className="surface p-5">
        <div className="grid gap-4 lg:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step.label} className="relative">
              {index < steps.length - 1 ? (
                <div className="absolute left-8 top-8 hidden h-0.5 w-[calc(100%-2rem)] bg-slate-200 dark:bg-slate-800 lg:block" />
              ) : null}
              <div className="relative z-10 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-adrde-navy text-sm font-bold text-white dark:bg-blue-500">
                  {index + 1}
                </div>
                <h2 className="text-sm font-semibold text-slate-950 dark:text-white">{step.label}</h2>
                <p className="mt-2 min-h-12 text-sm text-slate-600 dark:text-slate-300">{step.detail}</p>
                <div className="mt-4">
                  <Badge tone={tones[step.status]}>{step.status}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
