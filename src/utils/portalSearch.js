export function runPortalSearch(query, data) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const { meetings, agendas, documents, letters, inventory, notifications, activities } = data;
  const results = [];

  meetings.forEach((item) => {
    const text = `${item.id} ${item.title} ${item.venue} ${item.description}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `m-${item.id}`,
        type: 'Meeting',
        label: item.title,
        detail: `${item.id} · ${item.date}`,
        page: 'meetings-upcoming',
      });
    }
  });

  agendas.forEach((item) => {
    const text = `${item.id} ${item.topic} ${item.department}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `a-${item.id}`,
        type: 'Agenda',
        label: item.topic,
        detail: item.department,
        page: 'agendas',
      });
    }
  });

  documents.forEach((item) => {
    const text = `${item.id} ${item.name} ${item.type}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `d-${item.id}`,
        type: 'Document',
        label: item.name,
        detail: item.status,
        page: 'documents-view',
      });
    }
  });

  letters.forEach((item) => {
    const text = `${item.id} ${item.subject} ${item.reference}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `l-${item.id}`,
        type: 'Letter',
        label: item.subject,
        detail: item.direction,
        page: `letters-${item.direction.toLowerCase()}`,
      });
    }
  });

  inventory.forEach((item) => {
    const text = `${item.id} ${item.name} ${item.location}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `i-${item.id}`,
        type: 'Inventory',
        label: item.name,
        detail: item.category,
        page: `inventory-${item.category.toLowerCase()}`,
      });
    }
  });

  notifications.forEach((item) => {
    const text = `${item.title} ${item.message}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `n-${item.id}`,
        type: 'Notification',
        label: item.title,
        detail: item.category || item.type,
        page: 'notifications-alerts',
      });
    }
  });

  activities.forEach((item) => {
    const text = `${item.text} ${item.actor}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `act-${item.id}`,
        type: 'Activity',
        label: item.text,
        detail: item.time,
        page: 'reports-activity',
      });
    }
  });

  return results;
}
