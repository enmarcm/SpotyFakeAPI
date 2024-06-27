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
const ArtistsModelClass_1 = __importDefault(require("../models/ArtistsModelClass"));
const instances_1 = require("../data/instances");
class ArtistController {
    static getArtistsAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield ArtistsModelClass_1.default.getArtistsAll();
                return res.json(response);
            }
            catch (error) {
                console.error(`An error occurred while fetching the artists. Error: ${error}`);
                throw new Error(`An error occurred while fetching the artists. Error: ${error}`);
            }
        });
    }
    static getArtistById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield instances_1.ISpotifyAPIManager.getArtistById({ id });
                return res.json(response);
            }
            catch (error) {
                console.error(`An error ocurred in getArtistById. Error: ${error}`);
                throw new Error(`An error ocurred in getArtistById. Error: ${error}`);
            }
        });
    }
}
exports.default = ArtistController;
