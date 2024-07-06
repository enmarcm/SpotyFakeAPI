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
class LikesModelClass {
    static toggleLikeSong(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser, idSong, }) {
            try {
                // Buscar si ya existe un like del usuario para la canción
                const existingLike = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.LikeModel,
                    condition: { idUser, idSong },
                });
                if (existingLike) {
                    // Si existe, eliminar el like (deslikear)
                    yield instances_1.ITSGooseHandler.removeDocument({
                        Model: models_1.LikeModel,
                        id: existingLike._id,
                    });
                    return { message: "Song unliked successfully" };
                }
                else {
                    // Si no existe, agregar el like
                    yield instances_1.ITSGooseHandler.addDocument({
                        Model: models_1.LikeModel,
                        data: { idUser, idSong },
                    });
                    return { message: "Song liked successfully" };
                }
            }
            catch (error) {
                console.error("Error toggling like on song:", error);
                throw error;
            }
        });
    }
    static getLikesByUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser }) {
            try {
                console.log(idUser);
                // Buscar todos los likes del usuario
                const likes = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.LikeModel,
                    condition: { idUser },
                });
                return likes;
            }
            catch (error) {
                console.error("Error getting likes by user:", error);
                throw error;
            }
        });
    }
    static getLikesBySong(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idSong }) {
            try {
                // Buscar todos los likes de la canción
                const likes = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.LikeModel,
                    condition: { idSong },
                });
                return likes;
            }
            catch (error) {
                console.error("Error getting likes by song:", error);
                throw error;
            }
        });
    }
    static verifySongLikedByUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser, idSong, }) {
            try {
                // Buscar si el usuario ya le dio like a la canción
                const existingLike = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.LikeModel,
                    condition: { idUser, idSong },
                });
                return !!existingLike;
            }
            catch (error) {
                console.error("Error verifying song liked by user:", error);
                throw error;
            }
        });
    }
}
exports.default = LikesModelClass;
