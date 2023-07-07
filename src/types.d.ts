import { Request } from "express";

interface DefaultAttributes {
  _id?: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ISubscriber extends DefaultAttributes {
  type: string;
  email: string;
  cycle: number;
  fullName: string;
  isActive: boolean;
  totalCycle: number;
}

interface IAdmin extends DefaultAttributes {
  email: string;
  fullName: string;
  password: string;
  isActive: boolean;
}

interface IMail extends DefaultAttributes {
  date?: Date;
  cycle?: number;
  sent?: boolean;
  content: string;
  subject: string;
  subscriptionType: string;
}

interface ISubscriberMail extends DefaultAttributes {
  email: string;
  mailId: string;
  content: string;
  subject: string;
  date: Date;
}

type IEmail = {
  to: string[];
  subject: string;
  content: string;
  delieveryTime: Date;
  templateName: string;
  ["t:variables"]: string;
}

interface IRoles extends DefaultAttributes {}

interface IAdmin extends DefaultAttributes {
  role: IRole;
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
}


type IRole = "super-admin" | "admin"

type IToken = IAdmin | IUser;

interface IPaginator <T>{
  query?: T;
  page: number;
  limit: number;
  select?: string;
  populate?: string;
}

type CreateErr = (
  message: string,
  code?: number,
  validations?: object
) => Error;

type Token = {
  id: string;
  name: string;
  email: string;
  username: string;
  referralId: string;
  phoneNumber: string;
};

declare module "express-serve-static-core" {
  export interface Request {
    user: IToken;
    admin: IToken;
  }
}

type AppError = Error & {
  code: number;
  name?: string;
  message: string;
  validations?: object | null;
};

type Fix = any;
