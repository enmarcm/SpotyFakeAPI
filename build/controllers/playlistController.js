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
const PlaylistModelClass_1 = __importDefault(require("../models/PlaylistModelClass"));
const SongsModel_1 = __importDefault(require("../models/SongsModel"));
class PlaylistController {
    static createPlaylist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                const { name, description, idSongs } = req.body;
                if (!name || !idUser)
                    return res.status(400).json({ error: "Name and user ID are required" });
                const playlist = yield PlaylistModelClass_1.default.createPlaylist({
                    name,
                    description,
                    idSongs,
                    idUser,
                });
                return res.json(playlist);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while creating the playlist. Error: ${error}`,
                });
            }
        });
    }
    static getPlaylistById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    return res.status(400).json({ error: "Playlist ID is required" });
                const playlist = yield PlaylistModelClass_1.default.getPlaylistById({ id });
                const playlistSongs = yield Promise.all(playlist.idSongs.map((idSong) => __awaiter(this, void 0, void 0, function* () {
                    const song = yield SongsModel_1.default.getSongById(idSong);
                    console.log(song);
                    return song;
                })));
                const mappedItemPlaylist = Object.assign(Object.assign({}, playlist), { songs: playlistSongs });
                return res.json(mappedItemPlaylist);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while fetching the playlist. Error: ${error}`,
                });
            }
        });
    }
    static getPlayListByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                if (!name)
                    return res.status(400).json({ error: "Playlist name is required" });
                const playlist = yield PlaylistModelClass_1.default.getPlayListByName({ name });
                return res.json(playlist);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while fetching the playlist by name. Error: ${error}`,
                });
            }
        });
    }
    static editPlaylist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                const { name, description, idSongs } = req.body;
                const { idPlaylist } = req.params;
                if (!idPlaylist)
                    return res.status(400).json({ error: "Playlist ID is required" });
                const playlist = yield PlaylistModelClass_1.default.editPlaylist({
                    name,
                    description,
                    idSongs,
                    idUser,
                    idPlaylist,
                });
                return res.json(playlist);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while editing the playlist. Error: ${error}`,
                });
            }
        });
    }
    static editSongsPlaylist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                const { idSongs } = req.body;
                const { idPlaylist } = req.params;
                //verificar que la playlist es del usuario
                const playlistData = yield PlaylistModelClass_1.default.getPlaylistById({
                    id: req.params.idPlaylist,
                });
                console.log(playlistData);
                if (playlistData.idUser !== idUser)
                    return res.status(401).json({ error: "Unauthorized" });
                if (!idPlaylist)
                    return res.status(400).json({ error: "Playlist ID is required" });
                const playlist = yield PlaylistModelClass_1.default.editSongsPlaylist({
                    idSongs,
                    idPlaylist,
                });
                return res.json(playlist);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while editing songs in the playlist. Error: ${error}`,
                });
            }
        });
    }
    static deletePlaylist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    return res.status(400).json({ error: "Playlist ID is required" });
                const result = yield PlaylistModelClass_1.default.deletePlaylist({ id });
                return res.json(result);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while deleting the playlist. Error: ${error}`,
                });
            }
        });
    }
    static getAllPlaylistByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                if (!idUser)
                    return res.status(400).json({ error: "User ID is required" });
                const playlists = yield PlaylistModelClass_1.default.getAllPlaylistByUser({
                    idUser,
                });
                return res.json(playlists);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while fetching all playlists by user. Error: ${error}`,
                });
            }
        });
    }
}
exports.default = PlaylistController;
