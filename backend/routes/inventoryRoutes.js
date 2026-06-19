import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import * as inventory from '../controllers/inventoryController.js';

const router = Router();
router.use(authRequired, attachUser);

router.get('/', inventory.listInventory);
router.post('/', inventory.createInventory);
router.put('/:id', inventory.updateInventory);
router.delete('/:id', inventory.deleteInventory);

export default router;
