import fetcho from "./Fetcho";
import { BODY_FETCH_SPOTIFY, CONTENT_TYPE_SPOTIFY } from "../constants";
import { URLS } from "../enums";

//TODO: MAPEAR TODA LA INFORMACION QUE SE OBTIENE DE SPOTIFY
//TODO: GUARDAR TOKEN EN BD

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

  public async getSongByName({
    name,
    limit = 20,
    offset = 0,
    include_external = "audio",
  }: {
    name: string;
    limit?: number;
    offset?: number;
    include_external?: string;
  }) {
    await this.verifyTokenValid();

    try {
      const url = `${URLS.SPOTIFY_SEARCH}?q=${encodeURIComponent(
        name
      )}&type=track&limit=${limit}&offset=${offset}&include_external=${include_external}`;

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

  public async getSongByGenre({
    genre,
    artistLimit = 5,
    trackLimit = 10,
  }: {
    genre: string;
    artistLimit?: number;
    trackLimit?: number;
  }) {
    await this.verifyTokenValid();

    try {
      // Paso 1: Buscar artistas por género
      const artistSearchUrl = `${
        URLS.SPOTIFY_SEARCH
      }?q=genre:${encodeURIComponent(genre)}&type=artist&limit=${artistLimit}`;
      const artistResponse = (await fetcho({
        url: artistSearchUrl,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (artistResponse?.error) throw new Error(artistResponse?.error);
      if (
        !artistResponse ||
        !artistResponse.artists ||
        !artistResponse.artists.items
      )
        throw new Error("Error fetching artists by genre");

      // Paso 2: Obtener las canciones más populares de los artistas encontrados
      const tracks = [];
      for (const artist of artistResponse.artists.items) {
        const topTracksUrl = `${URLS.SPOTIFY_ARTISTS}/${artist.id}/top-tracks?market=US`;
        const topTracksResponse = (await fetcho({
          url: topTracksUrl,
          method: "GET",
          headers: this.headers,
        })) as any;

        if (topTracksResponse?.error) throw new Error(topTracksResponse?.error);

        if (!topTracksResponse || !topTracksResponse.tracks)
          throw new Error(
            `Error fetching top tracks for artist ${artist.name}`
          );

        tracks.push(...topTracksResponse.tracks.slice(0, trackLimit));
      }

      return tracks;
    } catch (error) {
      console.error("Error fetching songs by genre:", error);
      throw error;
    }
  }

  public async getSongById({ id }: { id: string }) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_BASE_URL}/tracks/${id}`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response) throw new Error("Error fetching song by ID");

      return response;
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
        url: `${URLS.SPOTIFY_BASE_URL}/artists/${id}`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response) throw new Error("Error fetching artist by ID");

      return response;
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
      // Paso 1: Obtener los detalles del álbum
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_ALBUMS}/${id}`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);
      if (!response) throw new Error("Error fetching album by ID");

      const artistsWithImages = await Promise.all(
        response.artists.map(async (artist: any) => {
          const artistDetails = (await fetcho({
            url: `https://api.spotify.com/v1/artists/${artist.id}`,
            method: "GET",
            headers: this.headers,
          })) as any;

          const imageUrl =
            artistDetails.images[0]?.url || "URL de imagen por defecto";

          return {
            ...artist,
            imageUrl,
          };
        })
      );

      const modifiedResponse = {
        ...response,
        artists: artistsWithImages,
      };

      return modifiedResponse;
    } catch (error) {
      console.error("Error fetching album by ID:", error);
      throw error;
    }
  }

  public async fetchGenreForSong(songId: string): Promise<string[]> {
    await this.verifyTokenValid(); // Asegurar que el token es válido

    try {
      const songDetailsResponse = (await fetcho({
        url: `${URLS.SPOTIFY_TRACKS}/${songId}`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (
        !songDetailsResponse ||
        !songDetailsResponse.artists ||
        songDetailsResponse.artists.length === 0
      ) {
        throw new Error("No artist information found for song");
      }

      const artistId = songDetailsResponse.artists[0].id; // Asumiendo el primer artista

      // Paso 2: Obtener detalles del artista para extraer los géneros
      const artistDetailsResponse = (await fetcho({
        url: `${URLS.SPOTIFY_ARTISTS}/${artistId}`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (!artistDetailsResponse || !artistDetailsResponse.genres) {
        throw new Error("No genre information found for artist");
      }

      return artistDetailsResponse.genres;
    } catch (error) {
      console.error("Error fetching genre for song:", error);
      throw error;
    }
  }

  async getArtistInfoById(id: string) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_ARTISTS}/${id}`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.genres)
        throw new Error("Error fetching artist info by ID");

      return response;
    } catch (error) {
      console.error("Error fetching artist info by ID:", error);
      throw error;
    }
  }

  public async getTopAlbums({
    country = "US",
    limit = 6,
  }: {
    country?: string;
    limit?: number;
  }) {
    await this.verifyTokenValid();

    try {
      const url = `${URLS.SPOTIFY_BROWSE}/new-releases?country=${country}&limit=${limit}`;

      const response = (await fetcho({
        url: url,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.albums)
        throw new Error("Error fetching top albums");

      return response.albums;
    } catch (error) {
      console.error("Error fetching top albums:", error);
      throw error;
    }
  }

  public async getAlbumTracks({ id }: { id: string }) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_BASE_URL}/albums/${id}/tracks`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.items)
        throw new Error("Error fetching album tracks");

      return response.items;
    } catch (error) {
      console.error("Error fetching album tracks:", error);
      throw error;
    }
  }

  public async getTopTracks({
    country = "US",
    limit = 6,
  }: {
    country?: string;
    limit?: number;
  }) {
    await this.verifyTokenValid();

    try {
      const url = `${URLS.SPOTIFY_BROWSE}/featured-playlists?country=${country}&limit=${limit}`;

      const response = (await fetcho({
        url: url,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      if (!response || !response.playlists || !response.playlists.items)
        throw new Error("Error fetching top tracks");

      const playlistId = response.playlists.items[0].id;
      const tracksResponse = (await fetcho({
        url: `${URLS.SPOTIFY_PLAYLISTS}/${playlistId}/tracks`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (tracksResponse?.error) throw new Error(tracksResponse?.error);

      if (!tracksResponse || !tracksResponse.items)
        throw new Error("Error fetching tracks from playlist");

      const formattedTracks = tracksResponse.items.map((item: any) => ({
        _id: item.track.id,
        idArtist: item.track.artists.map((artist: any) => artist.id),
        artistNames: item.track.artists.map((artist: any) => artist.name),
        name: item.track.name,
        duration: item.track.duration_ms,
        urlImage: item.track.album.images[0]?.url,
        urlSong: item.track.preview_url,
        date: item.track.album.release_date,
        albumName: item.track.album.name,
      }));

      return formattedTracks;
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      throw error;
    }
  }

  public async getAlbumsByArtistId({
    id,
    limit,
  }: {
    limit: number;
    id: string;
  }) {
    await this.verifyTokenValid();

    try {
      const response = (await fetcho({
        url: `${URLS.SPOTIFY_ARTISTS}/${id}/albums?limit=${limit}`,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);
      if (!response || !response.items)
        throw new Error("Error fetching albums by artist ID");

      // Mapear cada álbum para obtener detalles adicionales
      const albumsDetails = await Promise.all(
        response.items.map(async (album: any) => {
          // Obtener las canciones (tracks) del álbum
          const tracksResponse = (await fetcho({
            url: `${album.href}/tracks`,
            method: "GET",
            headers: this.headers,
          })) as any;

          if (tracksResponse?.error) throw new Error(tracksResponse?.error);

          return {
            id: album.id,
            name: album.name,
            releaseDate: album.release_date,
            tracks: tracksResponse.items.map((track: any) => ({
              name: track.name,
              id: track.id,
              urlImage: album.images[0]?.url,
              urlSong:
                track.preview_url ||
                "https://p.scdn.co/mp3-preview/a5d0a3cba66dd86d55bc674fd7571a60cf3a147f?cid=ef93c1139a084b05b496c4c209d98afc",
            })),
          };
        })
      );

      return albumsDetails;
    } catch (error) {
      console.error("Error fetching albums by artist ID:", error);
      throw error;
    }
  }

  public async getFamousSongByArtistId({ id }: { id: string }) {
    await this.verifyTokenValid(); // Verificar el token de acceso

    try {
      const limit = 8; // Número de canciones más populares que queremos obtener
      const country = "US"; // Especificar el país puede ser necesario para algunas APIs

      // Construir la URL para obtener las top tracks del artista
      const url = `${URLS.SPOTIFY_ARTISTS}/${id}/top-tracks?country=${country}`;

      // Hacer la solicitud a la API de Spotify
      const response = (await fetcho({
        url: url,
        method: "GET",
        headers: this.headers,
      })) as any;

      if (response?.error) throw new Error(response?.error);

      // Verificar que la respuesta contenga tracks
      if (!response || !response.tracks)
        throw new Error("Error fetching top tracks for artist ID");

      // Formatear las tracks para devolver solo la información relevante
      const formattedTracks = response.tracks
        .slice(0, limit)
        .map((track: any) => ({
          _id: track.id,
          idArtist: track.artists.map((artist: any) => artist.id),
          artistNames: track.artists.map((artist: any) => artist.name),
          name: track.name,
          duration: track.duration_ms,
          urlImage: track.album.images[0]?.url,
          urlSong: track.preview_url,
          date: track.album.release_date,
          albumName: track.album.name,
        }));

      return formattedTracks;
    } catch (error) {
      console.error("Error fetching famous songs by artist ID:", error);
      throw error;
    }
  }
}

export default SpotifyAPIManager;
