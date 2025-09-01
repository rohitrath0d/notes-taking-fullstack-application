export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
};
