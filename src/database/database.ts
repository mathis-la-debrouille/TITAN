import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { User } from "../entities/User";

export default async function createDatabaseConnection(): Promise<Connection> {
  return await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "myapp",
    entities: [User],
    synchronize: true,
  });
}