import { db } from "../../src";
import { comments, users } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username, // Added username to selection
      })
      .from(users)
      .where(eq(users.id, decoded.userId));

    return user;
  } catch (error) {
    return null;
  }
};

export default async function handler(req, res) {
  // Handle GET request for fetching comments
  if (req.method === "GET") {
    const { recipe_id } = req.query;

    if (!recipe_id) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    try {
      const recipeComments = await db
        .select()
        .from(comments)
        .where(eq(comments.recipe_id, parseInt(recipe_id)))
        .orderBy(comments.created_at);

      return res.status(200).json(recipeComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
  }

  // Handle POST request for creating comments
  if (req.method === "POST") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    try {
      const user = await getUserFromToken(token);
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const { content, recipe_id } = req.body;

      if (!content?.trim() || !recipe_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const [newComment] = await db
        .insert(comments)
        .values({
          recipe_id: parseInt(recipe_id),
          user_id: user.id,
          content: content.trim(),
          author_name: user.username, // Now using username instead of email
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({
        error: "Failed to create comment",
        details: error.message,
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
