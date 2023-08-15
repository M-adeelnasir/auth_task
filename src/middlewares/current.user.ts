import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { findUserByEmail } from '../services/user.service';

export const requireAdminSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //@ts-ignore
  const { email } = req.user;
  const user = await findUserByEmail(email);
  console.log('==========', user);

  if (user!.role !== 'admin') {
    throw new Error('Not AUthorized');
  }
  return next();
};
