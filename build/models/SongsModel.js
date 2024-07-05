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
const instances_1 = require("../data/instances");
const models_1 = require("../typegoose/models");
const instances_2 = require("../data/instances");
const ArtistsModelClass_1 = __importDefault(require("./ArtistsModelClass"));
const UserModelClass_1 = __importDefault(require("./UserModelClass"));
const PlaylistModelClass_1 = __importDefault(require("./PlaylistModelClass"));
const CryptManager_1 = __importDefault(require("../utils/CryptManager"));
class SongsModel {
    static addSongsApiToDB(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, genres, limit = 10, }) {
            let newSongsFound = 0;
            const initialLimit = limit;
            const maxLimit = 50;
            try {
                const condition = name
                    ? { name: { $regex: name.replace("%", " "), $options: "i" } }
                    : { genres: { $in: genres } };
                const songs = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.SongModel,
                    condition,
                });
                let mappedSongs = (Array.isArray(songs) ? songs : songs ? [songs] : []);
                const newSongsArray = [];
                while (newSongsFound < 5 && limit <= maxLimit) {
                    let spotifySongs = [];
                    if (name) {
                        spotifySongs = yield this.fetchSpotifySongs({ name, limit });
                    }
                    else if (genres && genres.length > 0) {
                        for (const genre of genres) {
                            const genreSongs = yield this.fetchSpotifySongs({
                                genre: genre,
                                limit,
                            });
                            spotifySongs.push(...genreSongs);
                        }
                    }
                    const newSongs = this.filterNewSongs(spotifySongs, mappedSongs);
                    if (newSongs.length > 0) {
                        yield this.addNewSongsToDB(newSongs);
                        mappedSongs = [...mappedSongs, ...newSongs];
                        newSongsFound += newSongs.length;
                    }
                    else {
                        break;
                    }
                    if (newSongsFound < 5) {
                        limit += initialLimit;
                    }
                    // Asegurarse de que limit no exceda maxLimit
                    if (limit > maxLimit) {
                        limit = maxLimit;
                    }
                    const mappedSongsFormatPromises = newSongs.map((song) => this.mapSongData(song));
                    const resolvedMappedSongs = yield Promise.all(mappedSongsFormatPromises);
                    newSongsArray.push(...resolvedMappedSongs);
                }
                return newSongsArray;
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
    }
    static getSongByName(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, page = 1, limit = 5, retry = false, }) {
            try {
                const mapPage = Math.max(page, 1);
                const mapLimit = Math.max(limit, 1);
                const offset = (mapPage - 1) * mapLimit;
                const mappedName = name.replace("%", " ");
                let songs = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.SongModel,
                    condition: { name: { $regex: mappedName, $options: "i" } },
                    limit: mapLimit,
                    offset,
                });
                let mappedSongs = Array.isArray(songs)
                    ? songs
                    : songs
                        ? [songs]
                        : [];
                if (mappedSongs.length < mapLimit) {
                    const totalSongsNeeded = mapPage * mapLimit;
                    const additionalSongsNeeded = totalSongsNeeded - (songs ? songs.length : 0);
                    const newSongs = yield this.addSongsApiToDB({
                        name,
                        limit: additionalSongsNeeded,
                    });
                    if (mapPage === 1) {
                        mappedSongs = [...mappedSongs, ...newSongs.slice(0, mapLimit)];
                    }
                    else {
                        const effectiveOffset = Math.max(0, additionalSongsNeeded - (mapPage - 1) * mapLimit);
                        mappedSongs = newSongs === null || newSongs === void 0 ? void 0 : newSongs.slice(effectiveOffset, effectiveOffset + mapLimit);
                    }
                }
                if (mappedSongs.length === 0 && !retry) {
                    this.getSongByName({ name, page: mapPage, limit, retry: true });
                }
                return mappedSongs;
            }
            catch (error) {
                console.error(error);
                throw new Error(`An error occurred while searching for the song. Error: ${error}`);
            }
        });
    }
    static getSongById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultDB = yield instances_1.ITSGooseHandler.searchId({
                    Model: models_1.SongModel,
                    id
                });
                if (!resultDB || (resultDB === null || resultDB === void 0 ? void 0 : resultDB.length) === 0 || (resultDB === null || resultDB === void 0 ? void 0 : resultDB.error)) {
                    const resultSpotify = yield instances_2.ISpotifyAPIManager.getSongById({ id });
                    if (!resultSpotify || (resultSpotify === null || resultSpotify === void 0 ? void 0 : resultSpotify.error))
                        throw new Error("Song not found");
                    const dataMapped = yield this.mapSongData(resultSpotify);
                    return dataMapped;
                }
                return resultDB;
            }
            catch (error) {
                console.error(error);
                throw new Error(`An error occurred while searching for the song. Error: ${error}`);
            }
        });
    }
    static getSongByGenre(_a) {
        return __awaiter(this, arguments, void 0, function* ({ genres, page = 1, limit = 5, }) {
            try {
                const mapPage = Math.max(page, 1);
                const mapLimit = Math.max(limit, 1);
                const offset = (mapPage - 1) * mapLimit;
                let songs = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.SongModel,
                    condition: {
                        genre: { $in: genres.map((genre) => new RegExp(genre, "i")) },
                    },
                    limit: mapLimit,
                    offset,
                });
                let mappedSongs = Array.isArray(songs)
                    ? songs
                    : songs
                        ? [songs]
                        : [];
                if (mappedSongs.length < mapLimit) {
                    const totalSongsNeeded = mapPage * mapLimit;
                    const additionalSongsNeeded = totalSongsNeeded - (songs ? songs.length : 0);
                    const newSongs = yield this.addSongsApiToDB({
                        genres,
                        limit: additionalSongsNeeded,
                    });
                    if (mapPage === 1) {
                        mappedSongs = [...mappedSongs, ...newSongs.slice(0, mapLimit)];
                    }
                    else {
                        const effectiveOffset = Math.max(0, additionalSongsNeeded - (mapPage - 1) * mapLimit);
                        mappedSongs = newSongs === null || newSongs === void 0 ? void 0 : newSongs.slice(effectiveOffset, effectiveOffset + mapLimit);
                    }
                }
                return mappedSongs;
            }
            catch (error) {
                console.error(error);
                throw new Error(`An error occurred while searching for songs by genre. Error: ${error}`);
            }
        });
    }
    static fetchSpotifySongs(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            if (options.name) {
                response = yield instances_2.ISpotifyAPIManager.getSongByName({
                    name: options.name,
                    limit: options.limit,
                });
            }
            else if (options.genre) {
                response = yield instances_2.ISpotifyAPIManager.getSongByGenre({
                    genre: options.genre,
                    artistLimit: options.limit,
                    trackLimit: options.limit,
                });
            }
            else {
                return [];
            }
            return response || [];
        });
    }
    static filterNewSongs(spotifySongs, mappedSongs) {
        const newData = spotifySongs.items;
        return newData === null || newData === void 0 ? void 0 : newData.filter((song) => !mappedSongs.some((mappedSong) => mappedSong.id === song.id));
    }
    //TODO: Cambiar esto ya que gasta mucho ancho de banda
    static addNewSongsToDB(newSongs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(newSongs.map((song) => __awaiter(this, void 0, void 0, function* () {
                const existingSong = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.SongModel,
                    condition: { _id: song.id },
                });
                if (!existingSong) {
                    // Iterar sobre el array de artistas de la canción
                    yield Promise.all(song.artists.map((artist) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const existingArtist = yield ArtistsModelClass_1.default.getArtistById({
                            id: artist.id,
                        });
                        if (!existingArtist) {
                            const artistData = yield instances_2.ISpotifyAPIManager.getArtistInfoById(artist.id);
                            if (!artistData) {
                                console.log("No se encontró información del artista.");
                                return;
                            }
                            yield ArtistsModelClass_1.default.addArtist({
                                id: artist.id,
                                name: artist.name,
                                dateOfJoin: new Date(),
                                urlImage: ((_a = artistData.images[0]) === null || _a === void 0 ? void 0 : _a.url) || "https://lastfm.freetls.fastly.net/i/u/770x0/dd90f6548472acf19dd781ef269b9d62.jpg#dd90f6548472acf19dd781ef269b9d62"
                            }).catch((error) => console.error(error)); // Manejo de errores en caso de que la promesa sea rechazada
                        }
                    })));
                    const dataMapped = yield this.mapSongData(song);
                    yield instances_1.ITSGooseHandler.addDocument({
                        Model: models_1.SongModel,
                        data: dataMapped,
                    });
                }
            })));
        });
    }
    static mapSongData(song) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            if (song._id && song.idArtist && song.artistNames) {
                return song;
            }
            const isValidBeforeFormatting = song.id &&
                song.name &&
                song.artists &&
                song.artists.some((artist) => artist.id && artist.name);
            if (!isValidBeforeFormatting) {
                console.log("Canción inválida, será omitida.");
                return;
            }
            const genres = yield instances_2.ISpotifyAPIManager.fetchGenreForSong(song.id);
            const newSong = {
                _id: song === null || song === void 0 ? void 0 : song.id,
                idArtist: ((_a = song === null || song === void 0 ? void 0 : song.artists) === null || _a === void 0 ? void 0 : _a.length) > 0
                    ? (_b = song.artists) === null || _b === void 0 ? void 0 : _b.map((artist) => artist === null || artist === void 0 ? void 0 : artist.id)
                    : ["unknown"],
                artistNames: (_c = song.artists) === null || _c === void 0 ? void 0 : _c.map((artist) => artist.name),
                name: song === null || song === void 0 ? void 0 : song.name,
                duration: song === null || song === void 0 ? void 0 : song.duration_ms,
                urlImage: ((_d = song.album) === null || _d === void 0 ? void 0 : _d.images[0])
                    ? (_e = song === null || song === void 0 ? void 0 : song.album) === null || _e === void 0 ? void 0 : _e.images[0].url
                    : "defaultImageUrl",
                urlSong: (song === null || song === void 0 ? void 0 : song.preview_url) ||
                    "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221",
                date: (_f = song === null || song === void 0 ? void 0 : song.album) === null || _f === void 0 ? void 0 : _f.release_date,
                genres: genres,
                albumName: (_g = song === null || song === void 0 ? void 0 : song.album) === null || _g === void 0 ? void 0 : _g.name,
            };
            return newSong;
        });
    }
    static addSong(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, idArtist, albumName, duration, urlSong = "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221", urlImage = "https://i.scdn.co/image/ab67616d0000b273e63232b00577a053120ca08f", date, idUser }) {
            try {
                const userArtist = yield UserModelClass_1.default.getUserInfo({ idUser });
                if (!userArtist.idArtist)
                    throw new Error("User is not an artist");
                const _id = CryptManager_1.default.generateRandom();
                const song = yield instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.SongModel,
                    data: { _id, idArtist, name, duration, urlSong, urlImage, date, albumName },
                });
                console.log(song);
                return song;
            }
            catch (error) {
                console.error(error);
                return {
                    error: `An error occurred while adding the song. Error: ${error}`,
                };
            }
        });
    }
    static deleteSong(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idSong, idUser }) {
            try {
                //Verificar que la cancion existe
                const song = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.SongModel,
                    condition: { _id: idSong },
                });
                if (!song || song.error)
                    throw new Error("Song not found");
                //verificar que el usuario sea dueño de esa cancion
                const userArtist = yield UserModelClass_1.default.getUserInfo({ idUser });
                if (!userArtist.idArtist)
                    throw new Error("User is not an artist");
                if (song.idArtist !== userArtist.idArtist)
                    throw new Error("User is not the owner of the song");
                //Eliminar de las listas de reproduccion que pertenezca
                const playlists = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.PlaylistModel,
                    condition: { idSongs: { $in: [idSong] } },
                });
                if (playlists && playlists.length > 0) {
                    playlists.forEach((playlist) => __awaiter(this, void 0, void 0, function* () {
                        const updatedSongs = playlist.idSongs.filter((idSong) => idSong !== idSong);
                        yield PlaylistModelClass_1.default.editSongsPlaylist({
                            idPlaylist: playlist._id,
                            idSongs: updatedSongs,
                        });
                    }));
                }
                //Eliminar de los likes
                yield instances_1.ITSGooseHandler.removeAllDocumentsByCondition({
                    Model: models_1.LikeModel,
                    condition: { idSong },
                });
                //Eliminar la cancion
                const deletedSong = yield instances_1.ITSGooseHandler.removeDocument({
                    Model: models_1.SongModel,
                    id: idSong,
                });
                return deletedSong;
            }
            catch (error) {
                console.error(error);
                return {
                    error: `An error occurred while deleting the song. Error: ${error}`,
                };
            }
        });
    }
}
exports.default = SongsModel;
