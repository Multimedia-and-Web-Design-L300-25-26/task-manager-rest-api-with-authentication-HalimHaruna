import dotenv from "dotenv";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach } from "@jest/globals";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Import app after environment variables are loaded
const { default: app } = await import("../src/app.js");

// Connect to test database before all tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

// Clean up database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

export default app;
