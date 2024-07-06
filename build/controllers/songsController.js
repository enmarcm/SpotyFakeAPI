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
const SongsModel_1 = __importDefault(require("../models/SongsModel"));
// import UserModelClass from "../models/UserModelClass";
const instances_1 = require("../data/instances");
const LikesModelClass_1 = __importDefault(require("../models/LikesModelClass"));
class SongsController {
    static getSongByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                const { songName } = req.params;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 15;
                if (!songName)
                    return res.status(400).json({ error: "Song name is required" });
                const songs = yield SongsModel_1.default.getSongByName({
                    name: songName,
                    page,
                    limit,
                });
                const parsedSongs = yield Promise.all(songs.map((song) => __awaiter(this, void 0, void 0, function* () {
                    const isLiked = yield LikesModelClass_1.default.verifySongLikedByUser({
                        idUser,
                        idSong: song._id,
                    });
                    return Object.assign(Object.assign({}, song), { isLiked });
                })));
                return res.json(parsedSongs);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while searching for the song. Error: ${error}`,
                });
            }
        });
    }
    static addSong(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, albumName, duration, urlImage, urlSong, date } = req.body;
                const { role, idUser, idArtist } = req;
                if (role === "user" || !idArtist)
                    return res
                        .status(401)
                        .json({ error: "You don't have permission to add a song" });
                //Obtener id de artista del user
                //TODO AQUI HAY QUE CAMBIAR LA DURACION
                if (!name || !idArtist || !albumName || !duration || !urlSong)
                    return res.status(400).json({ error: "All fields are required" });
                const song = yield SongsModel_1.default.addSong({
                    name,
                    idArtist,
                    albumName,
                    duration,
                    urlSong,
                    urlImage,
                    date,
                    idUser,
                });
                return res.json(song);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error ocurred while adding the song. Error: ${error}`,
                });
            }
        });
    }
    static getSongsByGenre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { genre } = req.params;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 15;
                if (!genre)
                    return res.status(400).json({ error: "Genre is required" });
                const newGenre = [genre];
                const songs = yield SongsModel_1.default.getSongByGenre({
                    genres: newGenre,
                    page,
                    limit,
                });
                return res.json(songs);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while searching for the songs. Error: ${error}`,
                });
            }
        });
    }
    static getSongsByGenre2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { genre } = req.params;
                const page = parseInt(req.query.page) || 1;
                if (!genre)
                    return res.status(400).json({ error: "Genre is required" });
                const songs = yield instances_1.ISpotifyAPIManager.getSongByGenre({ genre, page });
                const parsedSongs = songs.map((song) => {
                    const newValues = {
                        idSong: song.id,
                        name: song.name,
                        duration: song.duration_ms,
                        urlImage: song.album.images[0].url,
                        urlSong: song.preview_url ||
                            "https://firebasestorage.googleapis.com/v0/b/spotyfake-4453c.appspot.com/o/uploads%2FRingtone.mp3?alt=media&token=f8e9556a-4119-4a9c-b283-f289edc1f731",
                        artists: song.artists.map((artist) => ({
                            id: artist.id,
                            name: artist.name,
                        })),
                    };
                    return newValues;
                });
                return res.json(parsedSongs);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: `An error occurred while searching for the songs. Error: ${error}`,
                });
            }
        });
    }
    static deleteSong(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idSong } = req.params;
                const { idUser } = req;
                const result = yield SongsModel_1.default.deleteSong({ idSong, idUser });
                return res.json(result);
            }
            catch (error) {
                console.error(error);
                throw new Error(`An error occurred while deleting the song. Error: ${error}`);
            }
        });
    }
    static getSongById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const { idSong } = req.params;
                const { idUser } = req;
                if (!idSong) {
                    return res.status(400).json({ error: "Song id is required" });
                }
                let song;
                try {
                    song = yield SongsModel_1.default.getSongById(idSong);
                }
                catch (dbError) {
                    console.error(`Error fetching song from DB: ${dbError}`);
                }
                if (!song) {
                    try {
                        song = yield instances_1.ISpotifyAPIManager.getSongById({ id: idSong });
                    }
                    catch (apiError) {
                        console.error(`Error fetching song from Spotify API: ${apiError}`);
                        return res.status(404).json({ error: "Song not found" });
                    }
                }
                const artists = yield Promise.all((song.idArtist || song.artists).map((artist) => __awaiter(this, void 0, void 0, function* () {
                    var _g;
                    const artistInfo = yield instances_1.ISpotifyAPIManager.getArtistById({ id: artist.id || artist });
                    return {
                        id: artistInfo.id,
                        name: artistInfo.name,
                        followers: artistInfo.followers.total,
                        genres: artistInfo.genres,
                        urlImage: (_g = artistInfo.images[0]) === null || _g === void 0 ? void 0 : _g.url,
                    };
                })));
                const mappedSong = {
                    id: song._id || song.id,
                    urlImage: song.urlImage || ((_a = song.album.images[0]) === null || _a === void 0 ? void 0 : _a.url),
                    name: song.name,
                    duration: song.duration || song.duration_ms,
                    date: song.date || song.album.release_date,
                    url_song: song.urlSong || song.preview_url || "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221",
                    artists,
                    album: {
                        name: ((_b = song.album) === null || _b === void 0 ? void 0 : _b.name) || song.name,
                        urlImage: ((_d = (_c = song.album) === null || _c === void 0 ? void 0 : _c.images[0]) === null || _d === void 0 ? void 0 : _d.url) || song.urlImage,
                        id: ((_e = song.album) === null || _e === void 0 ? void 0 : _e.id) || song._id,
                        date: ((_f = song.album) === null || _f === void 0 ? void 0 : _f.release_date) || song.date,
                    },
                    isLiked: yield LikesModelClass_1.default.verifySongLikedByUser({ idUser, idSong: song._id || song.id })
                };
                return res.json(mappedSong);
            }
            catch (error) {
                console.error(`An error occurred while searching for the song. Error: ${error}`);
                return res.status(500).json({
                    error: `An error occurred while searching for the song. Error: ${error}`,
                });
            }
        });
    }
    static getTopSongs(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield instances_1.ISpotifyAPIManager.getTopTracks({});
                return res.json(response);
            }
            catch (error) {
                throw new Error(`An error occurred while fetching the top songs. Error: ${error}`);
            }
        });
    }
    static getTopArtistSongs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield instances_1.ISpotifyAPIManager.getFamousSongByArtistId({ id });
                return res.json(result);
            }
            catch (error) {
                console.error(`An error occurred while fetching the top songs. Error: ${error}`);
                throw new Error(`An error occurred while fetching the top songs. Error: ${error}`);
            }
        });
    }
    static getGenres(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield instances_1.ISpotifyAPIManager.obtainGenres();
                return res.json(response);
            }
            catch (error) {
                console.error(`Ocurrio un error en getGenres: ${error}`);
                throw new Error(`Ocurrio un error en getGenres: ${error}`);
            }
        });
    }
}
exports.default = SongsController;
