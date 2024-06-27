"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playlistController_1 = __importDefault(require("../controllers/playlistController"));
const playlistRouter = (0, express_1.Router)();
playlistRouter.get("/user", playlistController_1.default.getAllPlaylistByUser);
playlistRouter.get("/getById/:id", playlistController_1.default.getPlaylistById);
playlistRouter.post("/create", playlistController_1.default.createPlaylist);
playlistRouter.put("/edit/:idPlaylist", playlistController_1.default.editPlaylist);
playlistRouter.put("/editSongs/:idPlaylist", playlistController_1.default.editSongsPlaylist);
playlistRouter.delete("/delete/:id", playlistController_1.default.deletePlaylist);
exports.default = playlistRouter;
