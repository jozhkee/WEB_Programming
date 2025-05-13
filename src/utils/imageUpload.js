import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const saveImageToLocal = async (req) => {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      const file = files.image?.[0];
      const recipeData = fields.recipeData
        ? JSON.parse(fields.recipeData[0])
        : {};

      let imageUrl = null;

      if (file) {
        const uniqueFilename = `${uuidv4()}_${file.originalFilename}`;
        const newPath = path.join(uploadDir, uniqueFilename);

        try {
          fs.renameSync(file.filepath, newPath);

          // Use API route instead of static path
          imageUrl = `/api/uploads/${uniqueFilename}`;
        } catch (error) {
          reject(error);
          return;
        }
      }

      resolve({
        recipeData,
        imageUrl,
      });
    });
  });
};
