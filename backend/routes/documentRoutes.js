import { Router } from 'express';
import { authRequired, attachUser } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import * as documents from '../controllers/documentController.js';

const router = Router();
router.use(authRequired, attachUser);

router.get('/', documents.listDocuments);
router.post('/upload', upload.single('file'), documents.uploadDocument);
router.patch('/:id/archive', documents.archiveDocument);
router.get('/:id/download', documents.downloadDocument);

export default router;
