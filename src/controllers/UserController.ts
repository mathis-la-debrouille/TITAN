import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find();
  res.json(users);
});

router.get("/:id", async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

router.post("/", async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  await userRepository.save(user);
  res.status(201).json(user);
});

router.put("/:id", async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  await userRepository.save(user);
  res.json(user);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await userRepository.remove(user);
  res.status(204).send();
});

export { router as UserController };
