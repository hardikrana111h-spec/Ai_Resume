import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const allowedExt = ['.pdf', '.docx'];

  const extOk = allowedExt.some((ext) => file.originalname.toLowerCase().endsWith(ext));
  const mimeOk = allowedMimeTypes.includes(file.mimetype);

  if (!extOk && !mimeOk) {
    return cb(new Error('Only PDF and DOCX files are allowed'));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024)
  }
});