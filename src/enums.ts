import { BASE_URL } from "./constants";

export enum Routes {
  MAIN = "/",
  AUTH = "/auth",
  SONGS = "/songs",
}

export const URLS = {
  MAIN: BASE_URL,
  ACTIVATE_USER: `${BASE_URL}/auth/activateUser`,
  SPOTIFY_API: "https://api.spotify.com/",
  SPOTIFY_API_TOKEN: "https://accounts.spotify.com/api/token",
  SPOTIFY_SEARCH: "https://api.spotify.com/v1/search",
  SPOTIFY_ARTISTS: "https://api.spotify.com/v1/artists",
  SPOTIFY_TRACKS: "https://api.spotify.com/v1/tracks",
};

export enum Constants {
  ERROR = "error",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

