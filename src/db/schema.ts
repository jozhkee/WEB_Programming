import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  description: text("description"),
});
