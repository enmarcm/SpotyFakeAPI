import { Request, Response } from "express";
import ArtistModelClass from "../models/ArtistsModelClass";

class ArtistController {
  static async getArtistsAll(_req: Request, res: Response) {
    try {
      const response = await ArtistModelClass.getArtistsAll();
      return res.json(response);
    } catch (error) {
      console.error(
        `An error occurred while fetching the artists. Error: ${error}`
      );

      throw new Error(
        `An error occurred while fetching the artists. Error: ${error}`
      );
    }
  }

  static async getArtistById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await ArtistModelClass.getArtistById({ id });

      return res.json(response);
    } catch (error) {
      console.error(`An error ocurred in getArtistById. Error: ${error}`);
      throw new Error(`An error ocurred in getArtistById. Error: ${error}`);
    }
  }
}

export default ArtistController;
