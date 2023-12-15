import { NextFunction, Request, Response } from "express";
import { Secret, verify, VerifyErrors } from "jsonwebtoken";
import { config } from "dotenv";
config();

const JWT_SECRET: Secret = String(process.env.JWT_SECRET);

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.user_token || req.headers['authorization']?.split(" ")[1];

  if (!token) {
    res.json({ errorMessage: "Token doesn't exist!" });
  } else {
    verify(token, JWT_SECRET, (err: VerifyErrors | any, decoded: any) => {
      if (err) return res.json({ errorMessage: err?.message });
      next()
    })
  }
};
