import Inventory from '../models/Inventory.js';
import { logActivity } from '../utils/events.js';

export async function listInventory(req, res, next) {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { itemId: new RegExp(q, 'i') }, { department: new RegExp(q, 'i') }];
    const items = await Inventory.find(filter).sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function createInventory(req, res, next) {
  try {
    const item = await Inventory.create({
      ...req.body,
      updatedBy: req.user._id,
      updatedByName: req.user.name,
    });
    await logActivity('Inventory updated', req.user.name, req.user._id, 'inventory');
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateInventory(req, res, next) {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id, updatedByName: req.user.name },
      { new: true },
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await logActivity('Inventory updated', req.user.name, req.user._id, 'inventory');
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function deleteInventory(req, res, next) {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
}
