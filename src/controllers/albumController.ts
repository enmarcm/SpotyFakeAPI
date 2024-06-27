import { ISpotifyAPIManager } from "../data/instances";
import { Request, Response } from "express";

class AlbumController {
  static async getTopAlbum(_req: Request, res: Response) {
    try {
      const result = await ISpotifyAPIManager.getTopAlbums({});
      return res.json(result);
    } catch (error) {
      console.error(
        `An error occurred while fetching the top albums. Error: ${error}`
      );
      throw new Error(
        `An error occurred while fetching the top albums. Error: ${error}`
      );
    }
  }
}

export default AlbumController;
