import { ISpotifyAPIManager } from "../data/instances";
import { Request, Response } from "express";

class AlbumController {
  static async getTopAlbum(_req: Request, res: Response) {
    try {
      const result = await ISpotifyAPIManager.getTopAlbums({});

      const mappedResult = Promise.all(
        result.items.map(async (item: any) => {
          const albumSongs = await ISpotifyAPIManager.getAlbumTracks({
            id: item.id,
          });

          const mappedAlbumSongs = albumSongs.map((song: any) => {
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
        })
      );

      const newMappedResult = await mappedResult;
      return res.json(newMappedResult);
    } catch (error) {
      console.error(
        `An error occurred while fetching the top albums. Error: ${error}`
      );
      throw new Error(
        `An error occurred while fetching the top albums. Error: ${error}`
      );
    }
  }

  static async getAlbumByIdArtist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ISpotifyAPIManager.getAlbumsByArtistId({ id });

      const mappedResult = Promise.all(
        result.map(async (item: any) => {
          const albumSongs = await ISpotifyAPIManager.getAlbumTracks({
            id: item.id,
          });

          const mappedAlbumSongs = albumSongs.map((song: any) => {
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
        })
      );

      const newMappedResult = await mappedResult;
      return res.json(newMappedResult);
    } catch (error) {
      console.error(
        `An error occurred while fetching the albums by artist id. Error: ${error}`
      );
      throw new Error(
        `An error occurred while fetching the albums by artist id. Error: ${error}`
      );
    }
  }
}

export default AlbumController;
