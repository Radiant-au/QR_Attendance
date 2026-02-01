import { AppDataSource } from "@config/data-source";
import { User } from "@entities/Users";

export const UsersRepository = AppDataSource.getRepository(User);
