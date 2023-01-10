import multer from "multer";
import path from "path";
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath=`./files/products/${req.user.id}`;
    fs.mkdirSync(folderPath,{recursive:true});
    cb(null ,folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()  + path.extname(file.originalname));
  },
});
export const upload = multer({
  storage: storage,
});
