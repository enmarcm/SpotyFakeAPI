"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const albumController_1 = __importDefault(require("../controllers/albumController"));
const albumRouter = (0, express_1.Router)();
albumRouter.get("/top", albumController_1.default.getTopAlbum);
albumRouter.get("/artist/:id", albumController_1.default.getAlbumByIdArtist);
exports.default = albumRouter;
