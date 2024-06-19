import fetcho from "./Fetcho";
import { BODY_FETCH_SPOTIFY, CONTENT_TYPE_SPOTIFY } from "../constants";
import { URLS } from "../enums";


//TODO: MAPEAR TODA LA INFORMACION QUE SE OBTIENE DE SPOTIFY

class SpotifyAPIManager {
  private accessToken: string | null = null;
  private tokenExpiration: Date | null = null;
  private TOKEN_EXPIRATION_TIME = 3450;

  private async initialize() {
    try {
      const token = await this.obtainTokenSpotify();
      const expirationDate = new Date(
        new Date().getTime() + this.TOKEN_EXPIRATION_TIME * 1000
      );

      this.accessToken = token;
      this.tokenExpiration = expirationDate;
    } catch (error) {
      console.error("Failed to initialize SpotifyAPIManager:", error);
    }
  }

  private async obtainTokenSpotify(): Promise<string> {
    try {
      const response = await fetcho({
        url: URLS.SPOTIFY_API_TOKEN,
        method: "POST",
        headers: CONTENT_TYPE_SPOTIFY,
        body: BODY_FETCH_SPOTIFY,
      });

      if (!response || !response.access_token) {
        throw new Error("Error fetching Spotify access token");
      }
      console.log("Spotify access token fetched successfully");

      return response.access_token;
    } catch (error) {
      throw new Error(`Error fetching Spotify access token. Error: ${error}`);
    }
  }

  private async verifyTokenValid() {
    const now = new Date();
    if (
      !this.accessToken ||
      !this.tokenExpiration ||
      now >= this.tokenExpiration
    )
      await this.initialize();
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  public async getSongByName({ name, limit = 20, offset = 0, include_external = 'audio' }: { name: string, limit?: number, offset?: number, include_external?: string }) {
    await this.verifyTokenValid();

    try {
      const url = `${URLS.SPOTIFY_SEARCH}?q=${encodeURIComponent(name)}&type=track&limit=${limit}&offset=${offset}&include_external=${include_external}`;
      const response = (await fetcho({
        url: url,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.tracks)
        throw new Error("Error fetching song by name");

      return response.tracks;
    } catch (error) {
      console.error("Error fetching song by name:", error);
      throw error;
    }
  }

  public async getSongById({ id }: { id: string }) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_SEARCH}?q=id:${id}&type=track`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.tracks)
        throw new Error("Error fetching song by ID");

      return response.tracks;
    } catch (error) {
      console.error("Error fetching song by ID:", error);
      throw error;
    }
  }

  public async getArtistByName({ name }: { name: string }) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_SEARCH}?q=artist:${name}&type=artist`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.artists)
        throw new Error("Error fetching artist by name");

      return response.artists;
    } catch (error) {
      console.error("Error fetching artist by name:", error);
      throw error;
    }
  }

  public async getArtistById({ id }: { id: string }) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_SEARCH}?q=id:${id}&type=artist`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.artists)
        throw new Error("Error fetching artist by ID");

      return response.artists;
    } catch (error) {
      console.error("Error fetching artist by ID:", error);
      throw error;
    }
  }

  public async getAlbumByName({ name }: { name: string }) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_SEARCH}?q=album:${name}&type=album`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.albums)
        throw new Error("Error fetching album by name");

      return response.albums;
    } catch (error) {
      console.error("Error fetching album by name:", error);
      throw error;
    }
  }

  public async getAlbumById({ id }: { id: string }) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_SEARCH}?q=id:${id}&type=album`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.albums)
        throw new Error("Error fetching album by ID");

      return response.albums;
    } catch (error) {
      console.error("Error fetching album by ID:", error);
      throw error;
    }
  }
}

export default SpotifyAPIManager;
