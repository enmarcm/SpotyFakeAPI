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
const mainController_1 = __importDefault(require("../controllers/mainController"));
const instances_1 = require("../data/instances");
const mainRouter = (0, express_1.Router)();
mainRouter.get("/", mainController_1.default.root);
mainRouter.get("/test", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const respuesta = yield instances_1.ISpotifyAPIManager.getSongByName({ name: "La locura esta en mi" });
    res.json(respuesta);
}));
exports.default = mainRouter;
