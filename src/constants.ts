import "dotenv/config";
import { Response } from "express";
import { ErrorHandler, HostConfig, SpotifyData } from "./types";

export const PORT = Number(process.env.PORT) || 3000;

export const Hosts: Record<string, HostConfig> = {
  gmail: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  },
  outlook: {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
  },
};

const SPOTIFY_DATA: SpotifyData = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || "",
  REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI || "",
};

export const BODY_FETCH_SPOTIFY: string = `grant_type=client_credentials&client_id=${SPOTIFY_DATA.CLIENT_ID}&client_secret=${SPOTIFY_DATA.CLIENT_SECRET}`;

export const CONTENT_TYPE_SPOTIFY = {
  "Content-Type": "application/x-www-form-urlencoded",
};

export const ERROR_HANDLERS: Record<string, ErrorHandler> = {
  CastError: (res: Response) =>
    res.status(400).json({ error: "Malformatted ID" }),
  ValidationError: (res: Response) =>
    res.status(409).json({ error: "Validation error" }),
  JsonWebTokenError: (res: Response, message?: string) =>
    res.status(401).json({ error: "Invalid token", message }),
  TokenExpiredError: (res: Response, message?: string) =>
    res.status(401).json({ error: "Expired token", message }),
  defaultError: (res: Response) =>
    res.status(500).json({ error: "Something went wrong" }),
};

// export const BASE_URL:string = process.env.BASE_URL || `http://localhost:${PORT}`;
export const BASE_URL: string =
  process.env.BASE_URL || `http://192.168.109.126:${PORT}`;
