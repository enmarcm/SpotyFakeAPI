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

      console.log(song)
      
      const mappedSong = {
        name: song.name,
        id: song.id,
        duration_ms: song.duration_ms,
        urlImage: song.album.images[0].url,
        url_song: song.preview_url,
      };

      return res.json(mappedSong);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while searching for the song. Error: ${error}`,
      });
    }
  }
}

export default SongsController;
