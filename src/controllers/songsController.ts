import { Request, Response } from "express";
import SongsModel from "../models/SongsModel";

class SongsController {
  static async getSongByName(req: Request, res: Response) {
    try {
      const { songName } = req.params;

      if (!songName) {
        return res.status(400).json({ error: "Song name is required" });
      }

      const songs = await SongsModel.getSongByName({ name: songName });

      return res.json(songs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: `An error ocurred while searching for the song. Error: ${error}`,
      });
    }
  }
}

export default SongsController;
