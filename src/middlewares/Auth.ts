import { Request, Response, NextFunction } from "express";

const API_KEY = "MonalizaAdmin78hgIU45TY";

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.query.apiKey;

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: "Clé API invalide." });
  }

  // La clé API est valide, on continue avec la requête suivante
  next();
}
