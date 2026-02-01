import "reflect-metadata";
import { SeedService } from "../services/SeedService";

async function runSeed() {
  try {
    await SeedService.seedAdmin();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin user:", error);
    process.exit(1);
  }
}

runSeed();