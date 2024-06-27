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
}
exports.default = AlbumController;
