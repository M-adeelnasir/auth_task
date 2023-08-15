import { string, object } from 'yup';

export const verifyOPTSchema = object({
  body: object({
    opt: string().required('opt code is required'),
  }),
});
