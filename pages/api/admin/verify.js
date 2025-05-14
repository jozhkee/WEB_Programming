import { requireAdmin } from "../../../lib/adminAuth";

async function handler(req, res) {
  return res.status(200).json({ success: true });
}

export default requireAdmin(handler);
