import Shortcut from '../models/Shortcut.js';

export async function listShortcuts(req, res, next) {
  try {
    const shortcuts = await Shortcut.find({ enabled: true }).sort({ order: 1 });
    res.json(shortcuts);
  } catch (error) {
    next(error);
  }
}

export async function getShortcut(req, res, next) {
  try {
    const shortcut = await Shortcut.findOne({ key: req.params.key });
    if (!shortcut) return res.status(404).json({ message: 'Module not found' });
    shortcut.stats.visits += 1;
    shortcut.stats.lastVisited = new Date();
    await shortcut.save();
    res.json(shortcut);
  } catch (error) {
    next(error);
  }
}

export async function upsertShortcut(req, res, next) {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
    const shortcut = await Shortcut.findOneAndUpdate(
      { key: req.body.key },
      { $set: req.body },
      { upsert: true, new: true },
    );
    res.json(shortcut);
  } catch (error) {
    next(error);
  }
}

export async function deleteShortcut(req, res, next) {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
    await Shortcut.findOneAndDelete({ key: req.params.key });
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
}
