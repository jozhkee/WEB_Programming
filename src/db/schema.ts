import {
  pgTable,
  text,
  integer,
  serial,
  jsonb,
  varchar,
  timestamp,
  boolean,
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
  created_at: timestamp("created_at").defaultNow().notNull(),
  image_url: text("image_url"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  is_admin: boolean("is_admin").default(false).notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  recipe_id: integer("recipe_id").notNull(),
  user_id: integer("user_id").notNull(),
  content: text("content").notNull(),
  author_name: text("author_name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  display_name: varchar("display_name", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
