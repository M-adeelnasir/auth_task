import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';

export const validateRequest =
  (Schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };
