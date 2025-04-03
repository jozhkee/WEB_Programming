import { db } from "../src";
import { users } from "../src/db/schema";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

export async function seedUsers() {
  try {
    console.log("Starting to seed users...");

    // Hash passwords
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash("admin123", saltRounds);
    const chefPassword = await bcrypt.hash("chef123", saltRounds);
    const foodiePassword = await bcrypt.hash("foodie123", saltRounds);

    // Insert users
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          email: "admin@example.com",
          username: "admin",
          password: adminPassword,
          is_admin: true, // Set admin flag
        },
        {
          email: "chef@example.com",
          username: "masterchef",
          password: chefPassword,
          is_admin: false,
        },
        {
          email: "foodie@example.com",
          username: "foodlover",
          password: foodiePassword,
          is_admin: false,
        },
      ])
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        is_admin: users.is_admin,
      });

    console.log(
      `Seeded ${insertedUsers.length} users successfully:`,
      insertedUsers.map((user) => user.email).join(", ")
    );

    return insertedUsers;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
