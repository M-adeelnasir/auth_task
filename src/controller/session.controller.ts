import { Response, Request } from 'express';
import config from 'config';
import { findUserByEmail } from '../services/user.service';
import { createSession } from '../services/session.service';
import { jwtSign } from '../utils/jwt.utils';

export const sessionCreateleHandler = async (req: Request, res: Response) => {
  //validate user if exits
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user.verified) res.status(400).send('Email not verified');
  //comparing passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid Credentials');
  }
  //create login session
  const session = await createSession(user._id, req.get('user-agent') || '');

  //create user jwt access token
  const accessToken = await jwtSign(
    user,
    session,
    config.get('jwt_access_token_expired')
  );

  //publish the data to event bus

  //set the access token in cookie
  res.cookie('accessToken', accessToken, {
    maxAge: 300000, //5min
    httpOnly: true,
  });
  //set the refresh token in cookie
  res.cookie('refreshToken', {
    maxAge: 3.15e10, //1 year
    httpOnly: true,
  });

  res.status(201).send({ success: true, session, accessToken });
};
