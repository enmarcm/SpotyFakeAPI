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
const Fetcho_1 = __importDefault(require("./Fetcho"));
const constants_1 = require("../constants");
const enums_1 = require("../enums");
//TODO: MAPEAR TODA LA INFORMACION QUE SE OBTIENE DE SPOTIFY
//TODO: GUARDAR TOKEN EN BD
class SpotifyAPIManager {
    constructor() {
        this.accessToken = null;
        this.tokenExpiration = null;
        this.TOKEN_EXPIRATION_TIME = 3450;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.obtainTokenSpotify();
                const expirationDate = new Date(new Date().getTime() + this.TOKEN_EXPIRATION_TIME * 1000);
                this.accessToken = token;
                this.tokenExpiration = expirationDate;
            }
            catch (error) {
                console.error("Failed to initialize SpotifyAPIManager:", error);
            }
        });
    }
    obtainTokenSpotify() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, Fetcho_1.default)({
                    url: enums_1.URLS.SPOTIFY_API_TOKEN,
                    method: "POST",
                    headers: constants_1.CONTENT_TYPE_SPOTIFY,
                    body: constants_1.BODY_FETCH_SPOTIFY,
                });
                if (!response || !response.access_token) {
                    throw new Error("Error fetching Spotify access token");
                }
                console.log("Spotify access token fetched successfully");
                return response.access_token;
            }
            catch (error) {
                throw new Error(`Error fetching Spotify access token. Error: ${error}`);
            }
        });
    }
    verifyTokenValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (!this.accessToken ||
                !this.tokenExpiration ||
                now >= this.tokenExpiration)
                yield this.initialize();
        });
    }
    get headers() {
        return {
            Authorization: `Bearer ${this.accessToken}`,
        };
    }
    getSongByName(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, limit = 20, offset = 0, include_external = "audio", }) {
            yield this.verifyTokenValid();
            try {
                const url = `${enums_1.URLS.SPOTIFY_SEARCH}?q=${encodeURIComponent(name)}&type=track&limit=${limit}&offset=${offset}&include_external=${include_external}`;
                const response = (yield (0, Fetcho_1.default)({
                    url: url,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response || !response.tracks)
                    throw new Error("Error fetching song by name");
                return response.tracks;
            }
            catch (error) {
                console.error("Error fetching song by name:", error);
                throw error;
            }
        });
    }
    getSongByGenre(_a) {
        return __awaiter(this, arguments, void 0, function* ({ genre, artistLimit = 5, trackLimit = 10, }) {
            yield this.verifyTokenValid();
            try {
                // Paso 1: Buscar artistas por género
                const artistSearchUrl = `${enums_1.URLS.SPOTIFY_SEARCH}?q=genre:${encodeURIComponent(genre)}&type=artist&limit=${artistLimit}`;
                const artistResponse = (yield (0, Fetcho_1.default)({
                    url: artistSearchUrl,
                    method: "GET",
                    headers: this.headers,
                }));
                if (artistResponse === null || artistResponse === void 0 ? void 0 : artistResponse.error)
                    throw new Error(artistResponse === null || artistResponse === void 0 ? void 0 : artistResponse.error);
                if (!artistResponse ||
                    !artistResponse.artists ||
                    !artistResponse.artists.items)
                    throw new Error("Error fetching artists by genre");
                // Paso 2: Obtener las canciones más populares de los artistas encontrados
                const tracks = [];
                for (const artist of artistResponse.artists.items) {
                    const topTracksUrl = `${enums_1.URLS.SPOTIFY_ARTISTS}/${artist.id}/top-tracks?market=US`;
                    const topTracksResponse = (yield (0, Fetcho_1.default)({
                        url: topTracksUrl,
                        method: "GET",
                        headers: this.headers,
                    }));
                    if (topTracksResponse === null || topTracksResponse === void 0 ? void 0 : topTracksResponse.error)
                        throw new Error(topTracksResponse === null || topTracksResponse === void 0 ? void 0 : topTracksResponse.error);
                    if (!topTracksResponse || !topTracksResponse.tracks)
                        throw new Error(`Error fetching top tracks for artist ${artist.name}`);
                    tracks.push(...topTracksResponse.tracks.slice(0, trackLimit));
                }
                return tracks;
            }
            catch (error) {
                console.error("Error fetching songs by genre:", error);
                throw error;
            }
        });
    }
    getSongById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            yield this.verifyTokenValid();
            try {
                const response = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_BASE_URL}/tracks/${id}`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response)
                    throw new Error("Error fetching song by ID");
                return response;
            }
            catch (error) {
                console.error("Error fetching song by ID:", error);
                throw error;
            }
        });
    }
    getArtistByName(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name }) {
            yield this.verifyTokenValid();
            try {
                const response = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_SEARCH}?q=artist:${name}&type=artist`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response || !response.artists)
                    throw new Error("Error fetching artist by name");
                return response.artists;
            }
            catch (error) {
                console.error("Error fetching artist by name:", error);
                throw error;
            }
        });
    }
    getArtistById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            yield this.verifyTokenValid();
            try {
                const response = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_BASE_URL}/artists/${id}`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response)
                    throw new Error("Error fetching artist by ID");
                return response;
            }
            catch (error) {
                console.error("Error fetching artist by ID:", error);
                throw error;
            }
        });
    }
    getAlbumByName(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name }) {
            yield this.verifyTokenValid();
            try {
                const response = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_SEARCH}?q=album:${name}&type=album`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response || !response.albums)
                    throw new Error("Error fetching album by name");
                return response.albums;
            }
            catch (error) {
                console.error("Error fetching album by name:", error);
                throw error;
            }
        });
    }
    getAlbumById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            yield this.verifyTokenValid();
            try {
                // Paso 1: Obtener los detalles del álbum
                const response = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_ALBUMS}/${id}`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response)
                    throw new Error("Error fetching album by ID");
                const artistsWithImages = yield Promise.all(response.artists.map((artist) => __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    const artistDetails = (yield (0, Fetcho_1.default)({
                        url: `https://api.spotify.com/v1/artists/${artist.id}`,
                        method: "GET",
                        headers: this.headers,
                    }));
                    const imageUrl = ((_b = artistDetails.images[0]) === null || _b === void 0 ? void 0 : _b.url) || "URL de imagen por defecto";
                    return Object.assign(Object.assign({}, artist), { imageUrl });
                })));
                const modifiedResponse = Object.assign(Object.assign({}, response), { artists: artistsWithImages });
                return modifiedResponse;
            }
            catch (error) {
                console.error("Error fetching album by ID:", error);
                throw error;
            }
        });
    }
    fetchGenreForSong(songId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyTokenValid(); // Asegurar que el token es válido
            try {
                const songDetailsResponse = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_TRACKS}/${songId}`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (!songDetailsResponse ||
                    !songDetailsResponse.artists ||
                    songDetailsResponse.artists.length === 0) {
                    throw new Error("No artist information found for song");
                }
                const artistId = songDetailsResponse.artists[0].id; // Asumiendo el primer artista
                // Paso 2: Obtener detalles del artista para extraer los géneros
                const artistDetailsResponse = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_ARTISTS}/${artistId}`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (!artistDetailsResponse || !artistDetailsResponse.genres) {
                    throw new Error("No genre information found for artist");
                }
                return artistDetailsResponse.genres;
            }
            catch (error) {
                console.error("Error fetching genre for song:", error);
                throw error;
            }
        });
    }
    getArtistInfoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyTokenValid();
            try {
                const response = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_ARTISTS}/${id}`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response || !response.genres)
                    throw new Error("Error fetching artist info by ID");
                return response;
            }
            catch (error) {
                console.error("Error fetching artist info by ID:", error);
                throw error;
            }
        });
    }
    getTopAlbums(_a) {
        return __awaiter(this, arguments, void 0, function* ({ country = "US", limit = 6, }) {
            yield this.verifyTokenValid();
            try {
                const url = `${enums_1.URLS.SPOTIFY_BROWSE}/new-releases?country=${country}&limit=${limit}`;
                const response = (yield (0, Fetcho_1.default)({
                    url: url,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response || !response.albums)
                    throw new Error("Error fetching top albums");
                return response.albums;
            }
            catch (error) {
                console.error("Error fetching top albums:", error);
                throw error;
            }
        });
    }
    getAlbumTracks(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            yield this.verifyTokenValid();
            try {
                const response = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_BASE_URL}/albums/${id}/tracks`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response || !response.items)
                    throw new Error("Error fetching album tracks");
                return response.items;
            }
            catch (error) {
                console.error("Error fetching album tracks:", error);
                throw error;
            }
        });
    }
    getTopTracks(_a) {
        return __awaiter(this, arguments, void 0, function* ({ country = "US", limit = 6, }) {
            yield this.verifyTokenValid();
            try {
                const url = `${enums_1.URLS.SPOTIFY_BROWSE}/featured-playlists?country=${country}&limit=${limit}`;
                const response = (yield (0, Fetcho_1.default)({
                    url: url,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response || !response.playlists || !response.playlists.items)
                    throw new Error("Error fetching top tracks");
                const playlistId = response.playlists.items[0].id;
                const tracksResponse = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_PLAYLISTS}/${playlistId}/tracks`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (tracksResponse === null || tracksResponse === void 0 ? void 0 : tracksResponse.error)
                    throw new Error(tracksResponse === null || tracksResponse === void 0 ? void 0 : tracksResponse.error);
                if (!tracksResponse || !tracksResponse.items)
                    throw new Error("Error fetching tracks from playlist");
                const formattedTracks = tracksResponse.items.map((item) => {
                    var _a;
                    return ({
                        _id: item.track.id,
                        idArtist: item.track.artists.map((artist) => artist.id),
                        artistNames: item.track.artists.map((artist) => artist.name),
                        name: item.track.name,
                        duration: item.track.duration_ms,
                        urlImage: (_a = item.track.album.images[0]) === null || _a === void 0 ? void 0 : _a.url,
                        urlSong: item.track.preview_url,
                        date: item.track.album.release_date,
                        albumName: item.track.album.name,
                    });
                });
                return formattedTracks;
            }
            catch (error) {
                console.error("Error fetching top tracks:", error);
                throw error;
            }
        });
    }
    getAlbumsByArtistId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, limit, }) {
            yield this.verifyTokenValid();
            try {
                const response = (yield (0, Fetcho_1.default)({
                    url: `${enums_1.URLS.SPOTIFY_ARTISTS}/${id}/albums?limit=${limit}`,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                if (!response || !response.items)
                    throw new Error("Error fetching albums by artist ID");
                // Mapear cada álbum para obtener detalles adicionales
                const albumsDetails = yield Promise.all(response.items.map((album) => __awaiter(this, void 0, void 0, function* () {
                    // Obtener las canciones (tracks) del álbum
                    const tracksResponse = (yield (0, Fetcho_1.default)({
                        url: `${album.href}/tracks`,
                        method: "GET",
                        headers: this.headers,
                    }));
                    if (tracksResponse === null || tracksResponse === void 0 ? void 0 : tracksResponse.error)
                        throw new Error(tracksResponse === null || tracksResponse === void 0 ? void 0 : tracksResponse.error);
                    return {
                        id: album.id,
                        name: album.name,
                        releaseDate: album.release_date,
                        tracks: tracksResponse.items.map((track) => {
                            var _a;
                            return ({
                                name: track.name,
                                id: track.id,
                                urlImage: (_a = album.images[0]) === null || _a === void 0 ? void 0 : _a.url,
                                urlSong: track.preview_url ||
                                    "https://p.scdn.co/mp3-preview/a5d0a3cba66dd86d55bc674fd7571a60cf3a147f?cid=ef93c1139a084b05b496c4c209d98afc",
                            });
                        }),
                    };
                })));
                return albumsDetails;
            }
            catch (error) {
                console.error("Error fetching albums by artist ID:", error);
                throw error;
            }
        });
    }
    getFamousSongByArtistId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            yield this.verifyTokenValid(); // Verificar el token de acceso
            try {
                const limit = 8; // Número de canciones más populares que queremos obtener
                const country = "US"; // Especificar el país puede ser necesario para algunas APIs
                // Construir la URL para obtener las top tracks del artista
                const url = `${enums_1.URLS.SPOTIFY_ARTISTS}/${id}/top-tracks?country=${country}`;
                // Hacer la solicitud a la API de Spotify
                const response = (yield (0, Fetcho_1.default)({
                    url: url,
                    method: "GET",
                    headers: this.headers,
                }));
                if (response === null || response === void 0 ? void 0 : response.error)
                    throw new Error(response === null || response === void 0 ? void 0 : response.error);
                // Verificar que la respuesta contenga tracks
                if (!response || !response.tracks)
                    throw new Error("Error fetching top tracks for artist ID");
                // Formatear las tracks para devolver solo la información relevante
                const formattedTracks = response.tracks
                    .slice(0, limit)
                    .map((track) => {
                    var _a;
                    return ({
                        _id: track.id,
                        idArtist: track.artists.map((artist) => artist.id),
                        artistNames: track.artists.map((artist) => artist.name),
                        name: track.name,
                        duration: track.duration_ms,
                        urlImage: (_a = track.album.images[0]) === null || _a === void 0 ? void 0 : _a.url,
                        urlSong: track.preview_url,
                        date: track.album.release_date,
                        albumName: track.album.name,
                    });
                });
                return formattedTracks;
            }
            catch (error) {
                console.error("Error fetching famous songs by artist ID:", error);
                throw error;
            }
        });
    }
}
exports.default = SpotifyAPIManager;
