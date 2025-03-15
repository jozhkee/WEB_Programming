import { pgTable, text, integer, serial, jsonb, varchar } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: jsonb("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time"), 
  servings: integer("servings"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});
