"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likesController_1 = __importDefault(require("../controllers/likesController"));
const likesRouter = (0, express_1.Router)();
likesRouter.get("/toggleLike/:idSong", likesController_1.default.toggleLikeSong);
likesRouter.get("/getLikeByUser", likesController_1.default.getLikesByUser);
likesRouter.get("/verifySong/:idSong", likesController_1.default.verifySongLikedByUser);
exports.default = likesRouter;
