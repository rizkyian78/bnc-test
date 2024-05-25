import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import { join } from 'path';
import { allowedMimeTypes } from 'src/const/config';

export const multerConfig: MulterOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, join(__dirname, '../../uploads')); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB file size limit
  },
};
