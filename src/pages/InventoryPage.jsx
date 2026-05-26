import { useMemo, useState } from 'react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PermissionNotice from '../components/ui/PermissionNotice.jsx';
import { useApp } from '../context/AppContext.jsx';
import { can } from '../utils/permissions.js';

const modeMeta = {
  assets: { title: 'Assets', category: 'Assets' },
  equipment: { title: 'Equipment', category: 'Equipment' },
  requests: { title: 'Requests', category: 'Requests' },
  tracking: { title: 'Tracking', category: 'Tracking' },
};

const emptyForm = {
  name: '',
  location: '',
  custodian: '',
};

const statusTone = {
  'In Use': 'info',
  Available: 'success',
  'Pending Approval': 'warning',
  'In Transit': 'neutral',
};

export default function InventoryPage({ mode = 'assets' }) {
  const { addActivity, currentUser, inventory, searchQuery, setInventory } = useApp();
  const [form, setForm] = useState(emptyForm);
  const meta = modeMeta[mode] || modeMeta.assets;
  const canManage = can(currentUser, 'manage_inventory');

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesCategory = item.category === meta.category;
      if (!matchesCategory) return false;
      if (!query) return true;
      const haystack = `${item.id} ${item.name} ${item.location} ${item.custodian}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [inventory, meta.category, searchQuery]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canManage) return;

    const newItem = {
      id: `INV-${meta.category.charAt(0)}-${Date.now().toString().slice(-3)}`,
      category: meta.category,
      name: form.name,
      location: form.location,
      status: mode === 'requests' ? 'Pending Approval' : mode === 'tracking' ? 'In Transit' : 'Available',
      custodian: form.custodian || currentUser.department,
    };

    setInventory((items) => [newItem, ...items]);
    addActivity('Inventory updated', currentUser.name);
    setForm(emptyForm);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Monitor assets, equipment, requests, and shipment tracking using local mock records."
        eyebrow="Inventory"
        title={meta.title}
      />

      {!canManage ? (
        <PermissionNotice>Inventory updates are restricted for your role in this prototype.</PermissionNotice>
      ) : null}

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {canManage ? (
          <form className="surface p-5" onSubmit={handleSubmit}>
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">Add Inventory Item</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="label mb-2 block">Item Name</span>
                <input
                  className="field"
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                  value={form.name}
                />
              </label>
              <label className="block">
                <span className="label mb-2 block">Location</span>
                <input
                  className="field"
                  onChange={(event) => updateField('location', event.target.value)}
                  required
                  value={form.location}
                />
              </label>
              <label className="block">
                <span className="label mb-2 block">Custodian / Department</span>
                <input
                  className="field"
                  onChange={(event) => updateField('custodian', event.target.value)}
                  placeholder={currentUser.department}
                  value={form.custodian}
                />
              </label>
            </div>
            <Button className="mt-5" icon="plus" type="submit">
              Add Item
            </Button>
          </form>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredItems.map((item) => (
            <article key={item.id} className="surface p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">{item.id}</span>
                <Badge tone={statusTone[item.status] || 'neutral'}>{item.status}</Badge>
              </div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">{item.name}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Location: {item.location}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Custodian: {item.custodian}</p>
            </article>
          ))}
          {!filteredItems.length ? (
            <p className="col-span-full text-sm text-slate-500">No inventory items match the current filters.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
