interface Image {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
  author: string;
  userId: string;
}

export interface User {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  lastRequest?: Date;
  deletedOn?: Date | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isShadow: boolean | null;
  signupToken: string | null;
  resetPasswordToken?: string | null;
  avatarUrl?: string | null;
  oauth?: {
    google: boolean
  };
  usersImages?: Image[] | null,
}
