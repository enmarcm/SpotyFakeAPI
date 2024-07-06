"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const songsController_1 = __importDefault(require("../controllers/songsController"));
const models_1 = require("../typegoose/models");
const songRouter = (0, express_1.Router)();
songRouter.get("/top", songsController_1.default.getTopSongs);
songRouter.get("/getById/:idSong", songsController_1.default.getSongById);
songRouter.get("/genres", songsController_1.default.getGenres);
songRouter.get("/getByGenre/:genre", songsController_1.default.getSongsByGenre2);
songRouter.get("/updateAllOpen", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield models_1.SongModel.updateMany({ urlSong: { $regex: "spotify|open", $options: "i" } }, {
            urlSong: "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221",
        });
        res.status(200).send({ message: "URLs updated successfully", result });
    }
    catch (error) {
        res.status(500).send({ message: "Error updating URLs", error });
    }
}));
songRouter.get("/:songName", songsController_1.default.getSongByName);
songRouter.post("/add", songsController_1.default.addSong);
songRouter.delete("/delete/:id", songsController_1.default.deleteSong);
exports.default = songRouter;
