"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_URL = exports.ERROR_HANDLERS = exports.CONTENT_TYPE_SPOTIFY = exports.BODY_FETCH_SPOTIFY = exports.Hosts = exports.PORT = void 0;
require("dotenv/config");
exports.PORT = Number(process.env.PORT) || 3000;
exports.Hosts = {
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
const SPOTIFY_DATA = {
    CLIENT_ID: process.env.CLIENT_ID_SPOTIFY || "",
    CLIENT_SECRET: process.env.CLIENT_SECRET_SPOTIFY || "",
    REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI || "",
};
exports.BODY_FETCH_SPOTIFY = `grant_type=client_credentials&client_id=${SPOTIFY_DATA.CLIENT_ID}&client_secret=${SPOTIFY_DATA.CLIENT_SECRET}`;
exports.CONTENT_TYPE_SPOTIFY = {
    "Content-Type": "application/x-www-form-urlencoded",
};
exports.ERROR_HANDLERS = {
    CastError: (res) => res.status(400).json({ error: "Malformatted ID" }),
    ValidationError: (res) => res.status(409).json({ error: "Validation error" }),
    JsonWebTokenError: (res, message) => res.status(401).json({ error: "Invalid token", message }),
    TokenExpiredError: (res, message) => res.status(401).json({ error: "Expired token", message }),
    defaultError: (res) => res.status(500).json({ error: "Something went wrong" }),
};
// export const BASE_URL:string = process.env.BASE_URL || `http://localhost:${PORT}`;
exports.BASE_URL = process.env.BASE_URL || `http://192.168.109.126:${exports.PORT}`;
