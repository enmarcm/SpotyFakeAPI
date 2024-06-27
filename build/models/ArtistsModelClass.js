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
Object.defineProperty(exports, "__esModule", { value: true });
const instances_1 = require("../data/instances");
const models_1 = require("../typegoose/models");
class ArtistModelClass {
    static getArtistsAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = instances_1.ITSGooseHandler.searchAll({ Model: models_1.ArtistModel });
                return result;
            }
            catch (error) {
                console.error("Error fetching artists all:", error);
                throw error;
            }
        });
    }
    static addArtist(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, dateOfJoin, urlImage }) {
            try {
                const result = instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.ArtistModel,
                    data: { _id: id, name, dateOfJoin, urlImage },
                });
                return result;
            }
            catch (error) {
                console.error("Error adding artist:", error);
                throw error;
            }
        });
    }
    static getArtistById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = instances_1.ITSGooseHandler.searchOne({
                    condition: { _id: id },
                    Model: models_1.ArtistModel,
                });
                return result;
            }
            catch (error) {
                console.error("Error fetching artist by ID:", error);
                throw error;
            }
        });
    }
}
exports.default = ArtistModelClass;
