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
class SongsController {
    static getSongByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // revisar
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
                return res.json(songs);
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
                    idUser
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
                            "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221",
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
            try {
                const { idSong } = req.params;
                if (!idSong)
                    return res.status(400).json({ error: "Song id is required" });
                const song = yield instances_1.ISpotifyAPIManager.getSongById({ id: idSong });
                console.log(song);
                const mappedSong = {
                    name: song.name,
                    id: song.id,
                    duration_ms: song.duration_ms,
                    urlImage: song.album.images[0].url,
                    url_song: song.preview_url ||
                        "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221",
                    artists: yield Promise.all(song.artists.map((artist) => instances_1.ISpotifyAPIManager.getArtistById({ id: artist.id }))).then((artistsInfo) => artistsInfo.map((artistInfo) => ({
                        id: artistInfo.id,
                        name: artistInfo.name,
                        followers: artistInfo.followers.total,
                        genres: artistInfo.genres,
                        urlImage: artistInfo.images[0].url,
                    }))),
                    album: {
                        name: song.album.name,
                        urlImage: song.album.images[0].url,
                        id: song.album.id,
                    },
                    date: song.album.release_date,
                };
                return res.json(mappedSong);
            }
            catch (error) {
                console.error(error);
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
