"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = exports.Constants = exports.URLS = exports.Routes = void 0;
const constants_1 = require("./constants");
var Routes;
(function (Routes) {
    Routes["MAIN"] = "/";
    Routes["AUTH"] = "/auth";
    Routes["SONGS"] = "/songs";
    Routes["PROFILE"] = "/profile";
    Routes["PLAYLIST"] = "/playlist";
    Routes["ARTIST"] = "/artist";
    Routes["ALBUM"] = "/album";
})(Routes || (exports.Routes = Routes = {}));
exports.URLS = {
    MAIN: constants_1.BASE_URL,
    ACTIVATE_USER: `${constants_1.BASE_URL}/auth/activateUser`,
    SPOTIFY_API: "https://api.spotify.com/",
    SPOTIFY_API_TOKEN: "https://accounts.spotify.com/api/token",
    SPOTIFY_SEARCH: "https://api.spotify.com/v1/search",
    SPOTIFY_ARTISTS: "https://api.spotify.com/v1/artists",
    SPOTIFY_TRACKS: "https://api.spotify.com/v1/tracks",
    SPOTIFY_BROWSE: "https://api.spotify.com/v1/browse",
    SPOTIFY_BASE_URL: "https://api.spotify.com/v1",
    SPOTIFY_PLAYLISTS: "https://api.spotify.com/v1/playlists",
    SPOTIFY_ALBUMS: "https://api.spotify.com/v1/albums",
};
var Constants;
(function (Constants) {
    Constants["ERROR"] = "error";
})(Constants || (exports.Constants = Constants = {}));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
