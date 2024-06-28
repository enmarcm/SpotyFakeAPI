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
class AlbumController {
    static getTopAlbum(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield instances_1.ISpotifyAPIManager.getTopAlbums({});
                const mappedResult = Promise.all(result.items.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const albumSongs = yield instances_1.ISpotifyAPIManager.getAlbumTracks({
                        id: item.id,
                    });
                    const mappedAlbumSongs = albumSongs.map((song) => {
                        return {
                            name: song.name,
                            id: song.id,
                            duration_ms: song.duration_ms,
                            url_song: song.preview_url,
                        };
                    });
                    const objectResult = {
                        name: item.name,
                        id: item.id,
                        urlImage: item.images[0].url,
                        release_date: item.release_date,
                        total_tracks: item.total_tracks,
                        artists: item.artists,
                        songs: mappedAlbumSongs,
                    };
                    console.log(objectResult);
                    return objectResult;
                })));
                const newMappedResult = yield mappedResult;
                return res.json(newMappedResult);
            }
            catch (error) {
                console.error(`An error occurred while fetching the top albums. Error: ${error}`);
                throw new Error(`An error occurred while fetching the top albums. Error: ${error}`);
            }
        });
    }
    static getAlbumByIdArtist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { limit } = req.query;
                const result = yield instances_1.ISpotifyAPIManager.getAlbumsByArtistId({
                    id,
                    limit,
                });
                const mappedResult = Promise.all(result.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const albumSongs = yield instances_1.ISpotifyAPIManager.getAlbumTracks({
                        id: item.id,
                    });
                    const mappedAlbumSongs = albumSongs.map((song) => {
                        return {
                            name: song.name,
                            id: song.id,
                            duration_ms: song.duration_ms,
                            url_song: song.preview_url,
                        };
                    });
                    const objectResult = {
                        name: item.name,
                        id: item.id,
                        urlImage: item.tracks[0].urlImage,
                        release_date: item.release_date,
                        total_tracks: item.total_tracks,
                        artists: item.artists,
                        songs: mappedAlbumSongs,
                    };
                    return objectResult;
                })));
                const newMappedResult = yield mappedResult;
                return res.json(newMappedResult);
            }
            catch (error) {
                console.error(`An error occurred while fetching the albums by artist id. Error: ${error}`);
                throw new Error(`An error occurred while fetching the albums by artist id. Error: ${error}`);
            }
        });
    }
    static getAlbumById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield instances_1.ISpotifyAPIManager.getAlbumById({ id });
                const albumSongs = yield instances_1.ISpotifyAPIManager.getAlbumTracks({
                    id,
                });
                const mappedAlbumSongs = albumSongs.map((song) => {
                    return {
                        name: song.name,
                        id: song.id,
                        duration_ms: song.duration_ms,
                        url_song: song.preview_url,
                    };
                });
                const objectResult = {
                    name: result.name,
                    id: result.id,
                    urlImage: result.images[0].url,
                    release_date: result.release_date,
                    total_tracks: result.total_tracks,
                    artists: result.artists,
                    songs: mappedAlbumSongs,
                };
                return res.json(objectResult);
            }
            catch (error) {
                console.error(`An error occurred while fetching the album by id. Error: ${error}`);
                throw new Error(`An error occurred while fetching the album by id. Error: ${error}`);
            }
        });
    }
}
exports.default = AlbumController;
