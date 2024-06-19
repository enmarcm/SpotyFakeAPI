import fetcho from "./Fetcho";
import { BODY_FETCH_SPOTIFY, CONTENT_TYPE_SPOTIFY } from "../constants";
import { URLS } from "../enums";

class SpotifyAPIManager {
  static async obtainTokenSpotify() {
    try {
      const response = await fetcho({
        url: URLS.SPOTIFY_API_TOKEN,
        method: "POST",
        headers: CONTENT_TYPE_SPOTIFY,
        body: BODY_FETCH_SPOTIFY,
      });

      if (!response) throw new Error("Error fetching Spotify access token");

      return response?.access_token;
    } catch (error) {
      throw new Error(`Error fetching Spotify access token. Error: ${error}`);
    }
  }
}

export default SpotifyAPIManager;
