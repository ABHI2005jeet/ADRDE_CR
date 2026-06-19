import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const allowed = /\.(pdf|doc|docx|xls|xlsx|png|jpe?g|gif|webp)$/i;

const fileFilter = (_req, file, cb) => {
  if (allowed.test(file.originalname)) cb(null, true);
  else cb(new Error('Unsupported file type'));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });
export { uploadDir };
