import {
  pgTable,
  text,
  integer,
  serial,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  prep_time: integer("prep_time").notNull(),
  cook_time: integer("cook_time").notNull(),
  servings: integer("servings").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  user_id: integer("user_id").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});
