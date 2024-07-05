"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const functions_1 = require("./functions");
const middlewares_1 = require("./middlewares/middlewares");
const allRouters_1 = __importDefault(require("./routers/allRouters"));
const enums_1 = require("./enums");
const app = (0, express_1.default)();
//{ Middlewares
app.use((0, middlewares_1.midJson)());
app.use(middlewares_1.midValidJson);
app.use((0, middlewares_1.midCors)());
app.use(middlewares_1.midNotJson);
app.use(middlewares_1.midConnectDB);
//!TODO: Colocar de nuevo los tokens
//{ Routes
app.use(enums_1.Routes.AUTH, middlewares_1.midToken, allRouters_1.default.authRouter);
app.use(enums_1.Routes.SONGS, middlewares_1.midToken, allRouters_1.default.songRouter);
app.use(enums_1.Routes.PLAYLIST, middlewares_1.midToken, allRouters_1.default.playlistRouter);
app.use(enums_1.Routes.PROFILE, middlewares_1.midToken, allRouters_1.default.profileRouter);
app.use(enums_1.Routes.ARTIST, middlewares_1.midToken, allRouters_1.default.artistRouter);
app.use(enums_1.Routes.ALBUM, middlewares_1.midToken, allRouters_1.default.albumRouter);
app.use(middlewares_1.midErrorHandler);
app.use(middlewares_1.midNotFound);
(0, functions_1.startServer)({ app, PORT: constants_1.PORT });
