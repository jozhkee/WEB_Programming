import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { filename } = req.query;

  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for a year

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).json({ error: "Failed to serve file" });
  }
}
