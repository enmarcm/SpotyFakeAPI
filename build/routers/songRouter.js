"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const songsController_1 = __importDefault(require("../controllers/songsController"));
const songRouter = (0, express_1.Router)();
songRouter.get("/top", songsController_1.default.getTopSongs);
songRouter.get("/getById/:idSong", songsController_1.default.getSongById);
songRouter.get("/genres", songsController_1.default.getGenres);
songRouter.get("/:songName", songsController_1.default.getSongByName);
songRouter.post("/getByGenre", songsController_1.default.getSongsByGenre);
songRouter.post("/add", songsController_1.default.addSong);
songRouter.delete("/delete/:id", songsController_1.default.deleteSong);
exports.default = songRouter;
