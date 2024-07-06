"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRouter_1 = __importDefault(require("./authRouter"));
const mainRouter_1 = __importDefault(require("./mainRouter"));
const profileRouter_1 = __importDefault(require("./profileRouter"));
const songRouter_1 = __importDefault(require("./songRouter"));
const artistRouter_1 = __importDefault(require("./artistRouter"));
const playlistRouter_1 = __importDefault(require("./playlistRouter"));
const albumRouter_1 = __importDefault(require("./albumRouter"));
const likesRouter_1 = __importDefault(require("./likesRouter"));
exports.default = {
    artistRouter: artistRouter_1.default,
    authRouter: authRouter_1.default,
    mainRouter: mainRouter_1.default,
    profileRouter: profileRouter_1.default,
    songRouter: songRouter_1.default,
    playlistRouter: playlistRouter_1.default,
    albumRouter: albumRouter_1.default,
    likesRouter: likesRouter_1.default
};
