import { MessageData, MessageDetails } from "@trycourier/courier/api";
import { User, Email, InsertEmail, InsertUser } from "../database/schema";
import { Request, Response, NextFunction, Router } from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../database/schema";
import { Pool } from "pg";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export type UserPayload = {
  id: number;
  email: string;
  is2FAEnabled: boolean;
  is2FAVerified: boolean;
  isOauth2User: boolean;
};

export type Database = ReturnType<typeof drizzle<typeof schema>>;
export interface IDatabaseService {
  connect(pool: Pool): Promise<void>;
  getClient(): Database;
  disconnect(): Promise<void>;
}

export interface IBaseRepository<T, K> {
  create(item: K): Promise<T>;
  update(id: string | number, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  find(item: Partial<T>): Promise<T[]>;
  findOne(item: Partial<T>): Promise<Partial<T>>;
}
export interface IUserRepository extends IBaseRepository<User, InsertUser> {}
export interface IEmailRepository extends IBaseRepository<Email, InsertEmail> {}

export interface IEmailService {
  init: () => Promise<void>;
  resolve: () => void;
  sendEmail: (to: string, templateId: string, data: MessageData) => Promise<string>;
  getEmailById: (id: string) => Promise<MessageDetails>;
}

export interface ITwoFactorController {
  generate2faQr: (req: Request, res: Response<{ secret: string; qr: string }>, next?: NextFunction) => Promise<void>;
  enable2fa: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  verify2fa: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  disable2fa: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface IRouter {
  getRouter: () => Router;
}
export interface ITwoFactorRouter extends IRouter {}

export const TYPES = {
  IDatabaseService: Symbol("IDatabaseService"),
  ITwoFactorRouter: Symbol("ITwoFactorRouter"),
  ITwoFactorController: Symbol("ITwoFactorController"),
  IUserRepository: Symbol("IUserRepository"),
  IEmailRepository: Symbol("IEmailRepository"),
  IEmailService: Symbol("IEmailService"),
};

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}
