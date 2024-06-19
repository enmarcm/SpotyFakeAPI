import "dotenv/config";
import TSGooseHandler from "../components/TSGooseHandler";
import MailerConfigJson from "./jsons/mailerConfig.json";
import Mailer from "../components/Mailer";
import { MailerConfig } from "../types";
import JWTManager from "../components/JWTManager";

const connectionString = process.env.ConnectionString as string | "";

export const ITSGooseHandler = new TSGooseHandler({ connectionString });

export const INodeMailer = new Mailer({
  config: MailerConfigJson as MailerConfig,
});

export const IJWTManager = new JWTManager({
  SECRET_WORD: process.env.SECRET_WORD as string,
  expiresIn: process.env.JWT_EXPIRES_IN as string,
});