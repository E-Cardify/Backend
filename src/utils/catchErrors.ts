import { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchErrors =
  (controller: AsyncController): AsyncController =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };

export const catchSynchronousErrors =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
