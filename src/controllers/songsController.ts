import { Request, Response } from "express";
import SongsModel from "../models/SongsModel";
import UserModelClass from "../models/UserModelClass";
import { ISpotifyAPIManager } from "../data/instances";

class SongsController {
  static async getSongByName(req: Request, res: Response) {
    try {
      const { songName } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      if (!songName)
        return res.status(400).json({ error: "Song name is required" });

      const songs = await SongsModel.getSongByName({
        name: songName,
        page,
        limit,
      });

      return res.json(songs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while searching for the song. Error: ${error}`,
      });
    }
  }

  static async addSong(req: Request, res: Response) {
    try {
      const { name, albumName, duration, urlImage, urlSong, date } =
        req.body as any;

      const { role, idUser } = req as any;

      if (role === "user")
        return res
          .status(401)
          .json({ error: "You don't have permission to add a song" });

      //Obtener id de artista del user
      const userInfo = await UserModelClass.getUserInfo({ idUser });

      const { idArtist } = userInfo;

      //TODO AQUI HAY QUE CAMBIAR LA DURACION
      if (!name || !idArtist || !albumName || !duration || !urlSong)
        return res.status(400).json({ error: "All fields are required" });

      const song = await SongsModel.addSong({
        name,
        idArtist,
        albumName,
        duration,
        urlSong,
        urlImage,
        date,
      });

      return res.json(song);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error ocurred while adding the song. Error: ${error}`,
      });
    }
  }

  static async getSongsByGenre(req: Request, res: Response) {
    try {
      const { genre } = req.body;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      if (!genre) return res.status(400).json({ error: "Genre is required" });

      const newGenre = [genre];

      const songs = await SongsModel.getSongByGenre({
        genres: newGenre,
        page,
        limit,
      });

      return res.json(songs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while searching for the songs. Error: ${error}`,
      });
    }
  }

  static async deleteSong(req: Request, res: Response) {
    try {
      const { idSong } = req.params;
      const { idUser } = req as any;

      const result = await SongsModel.deleteSong({ idSong, idUser });

      return res.json(result);
    } catch (error) {
      console.error(error);
      throw new Error(
        `An error occurred while deleting the song. Error: ${error}`
      );
    }
  }

  static async getSongById(req: Request, res: Response) {
    try {
      const { idSong } = req.params;

      if (!idSong)
        return res.status(400).json({ error: "Song id is required" });

      const song = await ISpotifyAPIManager.getSongById({ id: idSong });

      console.log(song);

      const mappedSong = {
        name: song.name,
        id: song.id,
        duration_ms: song.duration_ms,
        urlImage: song.album.images[0].url,
        url_song:
          song.preview_url ||
          "https://p.scdn.co/mp3-preview/23de3926689af61772c7ccb7c7110b1f4643ddf4?cid=cfe923b2d660439caf2b557b21f31221",
        artists: await Promise.all(
          song.artists.map((artist: any) =>
            ISpotifyAPIManager.getArtistById({ id: artist.id })
          )
        ).then((artistsInfo) =>
          artistsInfo.map((artistInfo: any) => ({
            id: artistInfo.id,
            name: artistInfo.name,
            followers: artistInfo.followers.total,
            genres: artistInfo.genres,
            urlImage: artistInfo.images[0].url,
          }))
        ),
        album: {
          name: song.album.name,
          urlImage: song.album.images[0].url,
          id: song.album.id,
        },
        date: song.album.release_date,
      };

      return res.json(mappedSong);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while searching for the song. Error: ${error}`,
      });
    }
  }

  static async getTopSongs(_req: Request, res: Response) {
    try {
      const response = await ISpotifyAPIManager.getTopTracks({});

      return res.json(response);
    } catch (error) {
      throw new Error(
        `An error occurred while fetching the top songs. Error: ${error}`
      );
    }
  }

  static async getTopArtistSongs(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ISpotifyAPIManager.getFamousSongByArtistId({ id });

      return res.json(result);
    } catch (error) {
      console.error(
        `An error occurred while fetching the top songs. Error: ${error}`
      );
      throw new Error(
        `An error occurred while fetching the top songs. Error: ${error}`
      );
    }
  }

  static async getGenres(_req: Request, res: Response) {
    try {
      const response = await ISpotifyAPIManager.obtainGenres();
      return res.json(response);
    } catch (error) {
      console.error(`Ocurrio un error en getGenres: ${error}`);
      throw new Error(`Ocurrio un error en getGenres: ${error}`);
    }
  }
}

export default SongsController;
