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
class PlaylistModelClass {
    static createPlaylist(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, description, idSongs, idUser, }) {
            try {
                const result = instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.PlaylistModel,
                    data: { name, description, idSongs, idUser },
                });
                return result;
            }
            catch (error) {
                console.error("Error creating playlist:", error);
                throw error;
            }
        });
    }
    static getPlaylistById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = instances_1.ITSGooseHandler.searchOne({
                    condition: { _id: id },
                    Model: models_1.PlaylistModel,
                });
                return result;
            }
            catch (error) {
                console.error("Error fetching playlist by ID:", error);
                throw error;
            }
        });
    }
    static getPlayListByName(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name }) {
            try {
                const result = instances_1.ITSGooseHandler.searchOne({
                    condition: { name },
                    Model: models_1.PlaylistModel,
                });
                return result;
            }
            catch (error) {
                console.error("Error fetching playlist by name:", error);
                throw error;
            }
        });
    }
    static editPlaylist({ name, description, idSongs, idUser, idPlaylist, }) {
        try {
            const result = instances_1.ITSGooseHandler.editDocument({
                Model: models_1.PlaylistModel,
                id: idPlaylist,
                newData: { name, description, idSongs, idUser },
            });
            return result;
        }
        catch (error) {
            console.error("Error editing playlist:", error);
            throw error;
        }
    }
    static editSongsPlaylist(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idSongs, idPlaylist, }) {
            try {
                const result = instances_1.ITSGooseHandler.editDocument({
                    Model: models_1.PlaylistModel,
                    id: idPlaylist,
                    newData: { idSongs },
                });
                return result;
            }
            catch (error) {
                console.error("Error editing songs in playlist:", error);
                throw error;
            }
        });
    }
    static deletePlaylist(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = instances_1.ITSGooseHandler.removeDocument({
                    Model: models_1.PlaylistModel,
                    id,
                });
                return result;
            }
            catch (error) {
                console.error("Error deleting playlist:", error);
                throw Error;
            }
        });
    }
    static getAllPlaylistByUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser }) {
            try {
                const result = instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.PlaylistModel,
                    condition: { idUser: idUser },
                });
                return result;
            }
            catch (error) {
                console.error("Error fetching all playlists:", error);
                throw error;
            }
        });
    }
}
exports.default = PlaylistModelClass;
