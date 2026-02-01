import { AppDataSource } from "@config/data-source";
import { env } from "@config/env";
import { User } from "@entities/Users";
import { UsersRepository } from "@repositories/UsersRepository";
import { HashUtils } from "@utils/hash";
import { QrSignature } from "@utils/Signature";

export class SeedService {

    static async seedAdmin() {
        try {
            // Initialize database connection if not already initialized
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
                console.log("Database connection initialized");
            }

            // Check if admin already exists
            const existingAdmin = await UsersRepository.findOneBy({
                username: env.ADMIN_USERNAME,
            });

            if (existingAdmin) {
                console.log("Admin user 'Shopadmin' already exists. Skipping seed.");
                return;
            }

            // Create new admin user
            const admin = new User();
            admin.username = env.ADMIN_USERNAME;
            const hashedPassword = await HashUtils.hashPassword(env.ADMIN_PASSWORD);
            admin.password = hashedPassword;
            admin.role = "super_admin";
            admin.qrSecret = QrSignature.generateSignature(env.ADMIN_USERNAME);

            await UsersRepository.save(admin);
            console.log("Admin user 'Shopadmin' created successfully!");
        } catch (error) {
            console.error("Error seeding admin user:", error);
            throw error;
        } finally {
            // Close database connection
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
                console.log("Database connection closed");
            }
        }
    }

}