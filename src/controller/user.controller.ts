import { Response, Request } from 'express';
import { getUsers, searchUsers, signupUser } from '../services/user.service';
import { get, omit } from 'lodash';
import { findUserByEmail } from '../services/user.service';
import { sendEmailVerificationHandler } from './email-verification.controller';

export const createUserHandler = async (req: Request, res: Response) => {
  const user = await signupUser(req.body);
  console.log(user);
  sendEmailVerificationHandler(user.email, res);
};
export const users = async (req: Request, res: Response) => {
  const { status, page, limit } = req.body;
  const users = await getUsers(status, page, limit);
  res.json({
    users,
  });
};
export const searchUSerByQuery = async (req: Request, res: Response) => {
  const { query, page, limit } = req.body;
  const users = await searchUsers(query, page, limit);
  res.json({
    users,
  });
};
