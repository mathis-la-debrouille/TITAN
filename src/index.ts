import express from "express";
import bodyParser from "body-parser";
import createDatabaseConnection from "./database/database";
import { UserController } from "./controllers/UserController";
import { apiKeyMiddleware } from "./middlewares/apiKeyMiddleware";

async function startServer() {
    
    // Express setup 
    const app = express();
    const port = 3000;
    app.use(bodyParser.json());
    app.use(express.json());

    // Check de la clé unique
    app.use(apiKeyMiddleware)

    // Routes
    app.use("/users", UserController);

  try {
    // Create a new database connection
    const connection = await createDatabaseConnection();
    console.log("Connected to database");

    // Start the server
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error connecting to database: ", error);
  }
}

startServer();
