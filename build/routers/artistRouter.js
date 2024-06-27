"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artistsController_1 = __importDefault(require("../controllers/artistsController"));
const artistRouter = (0, express_1.Router)();
artistRouter.get("/getAll", artistsController_1.default.getArtistsAll);
artistRouter.get("/getId/:id", artistsController_1.default.getArtistById);
exports.default = artistRouter;
