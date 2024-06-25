import { Request, Response } from "express";
import PlaylistModelClass from "../models/PlaylistModelClass";

class PlaylistController {
  static async createPlaylist(req: Request, res: Response) {
    try {
      const { idUser } = req as any;
      const { name, description, idSongs } = req.body;

      if (!name || !idUser)
        return res.status(400).json({ error: "Name and user ID are required" });

      const playlist = await PlaylistModelClass.createPlaylist({
        name,
        description,
        idSongs,
        idUser,
      });

      return res.json(playlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while creating the playlist. Error: ${error}`,
      });
    }
  }

  static async getPlaylistById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(400).json({ error: "Playlist ID is required" });

      const playlist = await PlaylistModelClass.getPlaylistById({ id });

      return res.json(playlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while fetching the playlist. Error: ${error}`,
      });
    }
  }

  static async getPlayListByName(req: Request, res: Response) {
    try {
      const { name } = req.params;

      if (!name)
        return res.status(400).json({ error: "Playlist name is required" });

      const playlist = await PlaylistModelClass.getPlayListByName({ name });

      return res.json(playlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while fetching the playlist by name. Error: ${error}`,
      });
    }
  }

  static async editPlaylist(req: Request, res: Response) {
    try {
      const { idUser } = req as any;
      const { name, description, idSongs } = req.body;
      const { idPlaylist } = req.params;

      if (!idPlaylist)
        return res.status(400).json({ error: "Playlist ID is required" });

      const playlist = await PlaylistModelClass.editPlaylist({
        name,
        description,
        idSongs,
        idUser,
        idPlaylist,
      });

      return res.json(playlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while editing the playlist. Error: ${error}`,
      });
    }
  }

  static async editSongsPlaylist(req: Request, res: Response) {
    try {
      const { idUser } = req as any;
      const { idSongs } = req.body;
      const { idPlaylist } = req.params;

      //verificar que la playlist es del usuario
      const playlistData = await PlaylistModelClass.getPlaylistById({
        id: req.params.idPlaylist,
      });

      console.log(playlistData)
      if (playlistData.idUser !== idUser)
        return res.status(401).json({ error: "Unauthorized" });

      

      if (!idPlaylist)
        return res.status(400).json({ error: "Playlist ID is required" });

      const playlist = await PlaylistModelClass.editSongsPlaylist({
        idSongs,
        idPlaylist,
      });

      return res.json(playlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while editing songs in the playlist. Error: ${error}`,
      });
    }
  }

  static async deletePlaylist(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(400).json({ error: "Playlist ID is required" });

      const result = await PlaylistModelClass.deletePlaylist({ id });

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while deleting the playlist. Error: ${error}`,
      });
    }
  }

  static async getAllPlaylistByUser(req: Request, res: Response) {
    try {
      const { idUser } = req as any;

      if (!idUser)
        return res.status(400).json({ error: "User ID is required" });

      const playlists = await PlaylistModelClass.getAllPlaylistByUser({
        idUser,
      });

      return res.json(playlists);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error occurred while fetching all playlists by user. Error: ${error}`,
      });
    }
  }
}

export default PlaylistController;
