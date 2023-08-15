import { Response, Request } from 'express';
import { get } from 'lodash';
import { findUserByEmail } from '../services/user.service';
import sendEmail, {
  createEmailDocument,
  findEmailDocument,
  deleteEmailDocument,
} from '../services/email-verification.service';

export const sendEmailVerificationHandler = async (email: string, res: any) => {
  if (!email) {
    throw new Error('Login to verify your email');
  }

  const alreadyExits = await findEmailDocument(email);
  if (alreadyExits) {
    await deleteEmailDocument(email);
  }

  //@ts-ignore
  const user = await findUserByEmail(email);
  const opt = `${Math.floor(10000 + Math.random() * 900000)}`;

  if (user.verified) {
    throw new Error('User email is already register');
  }

  const response = await createEmailDocument({
    email,
    user: user._id,
    opt,
    createdAt: new Date(Date.now()),
    expiresAt: new Date(Date.now() + 360000),
  });

  const body = `<div>
  <h1>Verify Your Email</h1>
  <h4>your verification code is <b><u><h3>${opt}</h3></u></b></h4>
  <p style="color:red">Don't share your verfication anyone else</p>
  <br>
  <h2>Description</h2>
  <p>This code is auth application for more information or facing any problem you can contact <u>adeelnasirkbw@gmail.com</u></p>
  </div>`;

  const subject = 'Email Verification';

  const result = await sendEmail(email, subject, body);

  if (!result) {
    return res.status(500).json({ msg: 'Try later', success: false });
  }

  res.status(200).json({
    msg: ` Sign up successfully, Email send to ${response.email}. please verify before login`,
    success: true,
  });
};

export const verifyEmailOPThanlder = async (req: Request, res: Response) => {
  const email = get(req.user, 'email');
  const { opt } = req.body;
  //@ts-ignore
  const response = await findEmailDocument(email);
  if (!response) {
    throw new Error('Verify email again');
  }

  const isMatch = response.compareEmailOPT(opt);

  if (!isMatch) {
    throw new Error('Invalid OPT');
  }

  const currentTime = new Date(Date.now());

  if (response.expiresAt < currentTime) {
    throw new Error('OPT expired, verify again');
  }
  //@ts-ignore
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  user.set({ verified: true });

  await user.save();

  res.json({
    success: true,
    msg: 'Email verified',
  });
};
