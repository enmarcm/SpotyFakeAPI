import { Request, Response, NextFunction } from "express";
import { IdParams } from "../enums";

export default function midValidateId(req: Request, res: Response, next: NextFunction) {
  try {
    const idParams = Object.values(IdParams);

    const invalidParam = idParams.find((param) => {
      const idParam = req.params[param];
      return idParam && !idParam.match(/^[0-9a-fA-F]{24}$/);
    });

    if (invalidParam) {
      return res.status(400).json({ error: `Invalid ${invalidParam} format` });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
